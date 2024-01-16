import { time } from '@tensorflow/tfjs';
import React, { useEffect, useState } from 'react'
import MidiPlayer from 'midi-player-js';
import { SplendidGrandPiano, Soundfont } from "smplr";

function AudioTest() {
    const context = new AudioContext();
    const tempo = 120;


    //Track 2
    const harp = new Soundfont(context, {
        instrument: "orchestral_harp"
    });

    harp.load.then(() => {
        console.log("Violin loaded");
    })


    //track3
    const elecPiano = new Soundfont(context, {
        instrument: "electric_grand_piano"
    });

    elecPiano.load.then(() => {
        console.log("Electric piano loaded");
    });


    //track 4 and 7
    const acGuitar = new Soundfont(context, {
        instrument: "acoustic_guitar_nylon"
    });

    acGuitar.load.then(() => {
        console.log("Acoustic guitar loaded");
    });

    
    //track 5
    const ensemble1 = new Soundfont(context, {
        instrument: "synth_strings_1"
    });

    ensemble1.load.then(() => {
        console.log("Ensemble loaded");
    });


    //track 6
    const pads = new Soundfont(context, {
        instrument: "pad_2_warm"
    });

    pads.load.then(() => {
        console.log("Pads loaded");
    });



    var Player = new MidiPlayer.Player(function(event) {
        if (event.name == "Note on") {
            if (event.track == 2){
                harp.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
            } else if (event.track == 3){
                elecPiano.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
            } else if (event.track == 4 || event.track == 7){
                acGuitar.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
            } else if (event.track == 5){
                pads.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
                
            } else if (event.track == 6){
                ensemble1.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
            }
        }
    });

    fetch("/Fairy.mid")
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            Player.loadArrayBuffer(arrayBuffer);
        })

    const playNote = () => {
        var time = 0;
        ["C4", "E4", "G4", "C5"].forEach((note, i) => {
            const now = context.currentTime;
            console.log(now);
            
            piano.start({ note, time: now + time, duration: 0.5 });
            time+= 0.1;
        });
    }

    const play = () => {
        Player.play();
    }


    Player.on('midiEvent', function(event) {
        console.log(event);
    });

    const stop = () => {
        Player.stop();
    }


  return (
    <div>
        <button onClick={() => {
            playNote();
        }}>Test the audio</button>
        <button onClick={() => play()}>Play</button>
        <button onClick={() => stop()}>Stop</button>
        <button onClick={() => tempo - 10}>Lower Tempo</button>
    </div>
  )
}

export default AudioTest