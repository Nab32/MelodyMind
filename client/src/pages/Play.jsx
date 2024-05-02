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
    const wantedKeypoints = ["nose", "right_wrist", "left_wrist", "left_elbow", "right_elbow", "left_shoulder", "right_shoulder", "left_hip", "right_hip", "left_knee", "right_knee"];
    const [loading, setLoading] = useState(true);
    const [tempo, setTempo] = useState(70);
    const [playing, setPlaying] = useState(false);
    const modelManagerRef = useRef(null);
    const modelRendererRef = useRef(null);
    const audioManagerRef = useRef(null);
    const [positions, setPositions] = useState([]);
    var lastValue = 0;
    var isGoingDown = false;
    let lastTimestep = 0;
    var timeMoving = 0;
    var noiseCheck = 0;
    

    useEffect(() => {
        modelManagerRef.current  = new ModelManager();
        modelRendererRef.current = new ModelRenderer(canvasRef, webcamRef);
        audioManagerRef.current = new AudioManager();
        const loadModel = async () => {
            await modelManagerRef.current.loadModel();
            setLoading(false);
        };
        loadModel();
        audioManagerRef.current.loadSong("/JENOVA.midi", 5);
        handleFrame();
    }, []);

    //Play at random tempo
    useEffect(() => {
        if (playing){
            const intervalId = setInterval(() => {
                console.log("Tempo current: " + tempo);
                audioManagerRef.current.setTempo(parseInt(tempo));
              }, 100); // 200 milliseconds interval (5 times per second)
          
              // Cleanup function to clear the interval when the component is unmounted
              return () => clearInterval(intervalId);      
        }
      }, [tempo, playing]);


    /* Handles the frame */
    const handleFrame = async (timeStep) => {
        const elapsedMS = timeStep - lastTimestep;
        const elapsedSeconds = elapsedMS / 1000.0;

        if (elapsedSeconds < 1.0 / FPS) {
            requestAnimationFrame(handleFrame);
            return;
        }

        //Handling frame

        //audioManagerRef.current.setTempo(tempo);

        //Get the image from the webcam
        const imageSrc = webcamRef.current.video;
        

        //Get the keypoints from the image
        
        const poses = await modelManagerRef.current.getKeypoints(wantedKeypoints, imageSrc)
            .then((keypoints) => {
                if (keypoints) {
                    modelRendererRef.current.renderKeypoints(keypoints, COLORS.BLUE);

                    const right_elbow = keypoints.find(keypoint => keypoint.name === "right_elbow");
                    const right_wrist = keypoints.find(keypoint => keypoint.name === "right_wrist");
                    const right_shoulder = keypoints.find(keypoint => keypoint.name === "right_shoulder");

                    var currentAngle = modelManagerRef.current.getAngle(right_wrist.x, right_wrist.y, right_elbow.x, right_elbow.y, right_shoulder.x, right_shoulder.y);
                    getMovementTime(currentAngle);
                    //console.log(modelManagerRef.current.getAngle(right_wrist.x, right_wrist.y, right_elbow.x, right_elbow.y, right_shoulder.x, right_shoulder.y))
                    //console.log();

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

    const getMovementTime = (currentAngle) => {
        if (isGoingDown) {
            if (lastValue < currentAngle) {
                timeMoving++;
                noiseCheck = 0;
            } else {
                timeMoving++;
                noiseCheck++;
            }
        } else {
            if (lastValue > currentAngle) {
                timeMoving++;
                noiseCheck = 0;
            } else {
                timeMoving++;
                noiseCheck++;
            }
        }
        if (noiseCheck > 2) {
            noiseCheck = 0;
            var value = ((-25/4) * timeMoving) + 217.5;
            if (value > 200) {
                setTempo(200);
            } else if (value < 30) {
                setTempo(30);
            } else if (value > 300) {
                setTempo(0);
            } else {
                setTempo(value);
            }
            isGoingDown = !isGoingDown;
            timeMoving = 0;
        }
        lastValue = currentAngle;
    }


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
        <button onClick={() => {
            audioManagerRef.current.play()
            setPlaying(true);
        }}>Play audio</button>
        {
            playing ? (
            <div>
                <h1>Wanted Tempo: {audioManagerRef.current.wantedTempo}</h1>
                <h1>Tempo: {tempo}</h1>
            </div>
            ) : null
        }
        <button onClick={() => audioManagerRef.current.setTempo(60)}>Set tempo</button>
        <button onClick={() => audioManagerRef.current.setTempo(170)}>up tempo</button>
        <button onClick={() => setTempo(tempo+1)}>Test</button>
    </div>
  )
}

export default Play