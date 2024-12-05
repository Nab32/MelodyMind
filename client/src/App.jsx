import React, { useRef, useCallback, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Play from './pages/Play';
import AudioTest from './pages/AudioTest';
import SelectPage from './pages/SelectPage';

function App() {

  return (
    <div>
        <div className="navbar rounded-lg">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/">Homepage</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="/play">Play</a>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Melody Mind</a>
        </div>
      </div>
      <Router>
        <Routes>
          <Route path="/audiotest" element={<AudioTest/>}></Route>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/play/:songId" element={<Play />} />
          <Route path="/selectGame" element={<SelectPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
