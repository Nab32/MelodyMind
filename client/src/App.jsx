import React, { useRef, useCallback, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Play from './pages/Play';
import AudioTest from './pages/AudioTest';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/audiotest" element={<AudioTest/>}></Route>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/play" element={<Play />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
