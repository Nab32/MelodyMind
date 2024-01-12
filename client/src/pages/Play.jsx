import React, {useEffect, useRef} from 'react'
import Webcam from 'react-webcam';
import '../assets/css/Play.css';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import ModelManager from '../assets/js/modelManager';
import ModelRenderer from '../assets/js/modelRenderer';
import { WEBCAM_HEIGHT, WEBCAM_WIDTH } from '../assets/js/consts';

function Play() {

    
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const modelManagerRef = useRef(null);
    const modelRendererRef = useRef(null);

    useEffect(() => {
        modelManagerRef.current  = new ModelManager();
        modelRendererRef.current = new ModelRenderer(canvasRef, webcamRef);
        const loadModel = async () => {
            modelManagerRef.current.loadModel();
        };
        loadModel();
        handleFrame();
    });


    const handleFrame = async () => {
        //Gives us the URL to image
        const imageSrc = webcamRef.current.video;
        
        const nose = await modelManagerRef.current.getKeypoints(["nose", "left_eye"], imageSrc)
            .then((keypoints) => {
                if (keypoints) {
                    console.log(keypoints);
                    modelRendererRef.current.renderCameraImage();
                } else {
                    console.log("No nose found");
                }
            })
        requestAnimationFrame(handleFrame);
    }

    const videoConstraints = {
        width: WEBCAM_WIDTH,
        height: WEBCAM_HEIGHT,
        facingMode: "user"
    };


  return (
    <div>
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
    </div>
  )
}

export default Play