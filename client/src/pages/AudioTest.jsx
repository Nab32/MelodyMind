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
import { DrumMachine, getDrumMachineNames } from "smplr";

function AudioTest() {



    // Drum samples could have variations:
    const audioManagerRef = useRef(null);

    useEffect(() => {
      async function loadAudio() {

        audioManagerRef.current = new AudioManager();

        await audioManagerRef.current.loadSong("/JENOVA.midi", 5);
        console.log("test")
      }

      loadAudio();
    }, []);

  return (
    <div>
        <button onClick={() => audioManagerRef.current.play()}>Play</button>
    </div>
  )
}

export default AudioTest