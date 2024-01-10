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
    

    const handleFrame = async () => {
        //Gives us the URL to image
        const imageSrc = webcamRef.current.video;
        const poses = modelManager.estimatePoseOnImage(imageSrc)
            .then((poses) => {console.log(poses[0])});
        requestAnimationFrame(handleFrame);
    }

    const videoConstraints = {
        width: WEBCAM_WIDTH,
        height: WEBCAM_HEIGHT,
        facingMode: "user"
    };

    useEffect(() => {
        modelManager.loadModel();
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
    </div>
  )
}

export default Play