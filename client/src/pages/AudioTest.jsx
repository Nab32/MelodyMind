import React, {useEffect, useRef, useState} from 'react'
import '../assets/css/Play.css';
import '@tensorflow/tfjs-backend-webgl';
import AudioManager from '../assets/js/audioManager';
import { Songs } from '../constants/songs';

function AudioTest() {

  const audioManagerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      async function loadAudio() {
          audioManagerRef.current = new AudioManager();
          await audioManagerRef.current.loadSong("/mario_theme.mid", Songs.SUPER_MARIO_BROS_THEME);
          setLoading(false); // Set loading to false when everything is loaded
      }

      loadAudio();
  }, []);

  if (loading) {
      return <div>Loading...</div>; // Show this message while loading
  }

  return (
    <div>
        <button className="btn btn-accent" onClick={() => audioManagerRef.current.play()}>Play</button>
        <h1 className="text-3xl font-bold underline">Testing</h1>
    </div>
  )
}

export default AudioTest