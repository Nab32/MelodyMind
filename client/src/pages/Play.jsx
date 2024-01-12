import React, {useEffect, useRef} from 'react'
import Webcam from 'react-webcam';
import '../assets/css/Play.css';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import ModelManager from '../assets/js/handleModel';
import { WEBCAM_HEIGHT, WEBCAM_WIDTH } from '../assets/js/consts';

function Play() {

    const modelManager = new ModelManager();
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    

    const handleFrame = async () => {
        //Gives us the URL to image
        const imageSrc = webcamRef.current.video;
        const imageData = webcamRef.current.getScreenshot({width: WEBCAM_WIDTH, height: WEBCAM_HEIGHT});
        const base_image = new Image();
        base_image.src = imageData;

        const ctx = canvasRef.current.getContext("2d");
        ctx.fillStyle = "orange";
        
        const nose = await modelManager.getKeypoint("nose", imageSrc)
            .then((noses) => {
                if (noses) {
                    console.log(noses);
                    ctx.fillRect(noses.x, noses.y, 20, 20);
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

    useEffect(() => {
        modelManager.loadModel();

        var ctx = canvasRef.current.getContext("2d");
        requestAnimationFrame(handleFrame);
    });

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