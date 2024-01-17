import React, {useEffect, useRef, useState} from 'react'
import Webcam from 'react-webcam';
import '../assets/css/Play.css';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import ModelManager from '../assets/js/modelManager';
import ModelRenderer from '../assets/js/modelRenderer';
import AudioManager from '../assets/js/audioManager';
import { WEBCAM_HEIGHT, WEBCAM_WIDTH, COLORS, FPS } from '../assets/js/consts';


function Play() {

    
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    var test = 0;

    const [loading, setLoading] = useState(true);

    const modelManagerRef = useRef(null);
    const modelRendererRef = useRef(null);
    const audioManagerRef = useRef(null);

    let lastTimestep = 0;
    

    useEffect(() => {
        modelManagerRef.current  = new ModelManager();
        modelRendererRef.current = new ModelRenderer(canvasRef, webcamRef);
        audioManagerRef.current = new AudioManager();
        const loadModel = async () => {
            await modelManagerRef.current.loadModel();
            setLoading(false);
        };
        loadModel();
        audioManagerRef.current.loadSong("/overworldZelda.mid");
        handleFrame();
    });

    /* Handles the frame */
    const handleFrame = async (timeStep) => {
        test++;
        if (test % 200 == 0) {
            console.log("yep");
        }
        const elapsedMS = timeStep - lastTimestep;
        const elapsedSeconds = elapsedMS / 1000.0;

        if (elapsedSeconds < 1.0 / FPS) {
            requestAnimationFrame(handleFrame);
            return;
        }

        //Handling frame

        //Get the image from the webcam
        const imageSrc = webcamRef.current.video;
        

        //Get the keypoints from the image
        const wantedKeypoints = ["nose", "right_wrist", "left_wrist", "left_elbow", "right_elbow", "left_shoulder", "right_shoulder", "left_hip", "right_hip", "left_knee", "right_knee"];
        const poses = await modelManagerRef.current.getKeypoints(wantedKeypoints, imageSrc)
            .then((keypoints) => {
                if (keypoints) {
                    modelRendererRef.current.renderKeypoints(keypoints, COLORS.BLUE);
                } else {
                    console.log("No keypoints found");
                }
            })
        lastTimestep = timeStep;

        requestAnimationFrame(handleFrame);
    }

    const videoConstraints = {
        width: WEBCAM_WIDTH,
        height: WEBCAM_HEIGHT,
        facingMode: "user"
    };


  return (
    <div>
        {loading ? <div>Loading...</div> : null}
        <Webcam 
            audio={false}
            height={WEBCAM_HEIGHT}
            screenshotFormat="image/jpeg"
            width={WEBCAM_WIDTH}
            videoConstraints={videoConstraints}
            className="webcam"
            ref={webcamRef}
        />
        <canvas ref={canvasRef} height={WEBCAM_HEIGHT} width={WEBCAM_WIDTH} id="canvas" className="canvas"></canvas>
        <button onClick={() => audioManagerRef.current.play()}>Play audio</button>
    </div>
  )
}

export default Play