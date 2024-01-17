import { time } from '@tensorflow/tfjs';
import React, { useEffect, useState } from 'react'
import MidiPlayer from 'midi-player-js';
import { SplendidGrandPiano, Soundfont } from "smplr";

function AudioTest() {
    const context = new AudioContext();
    var tempo = 80;
    var harpAllowed = true;
    var elecPianoAllowed = true;
    var acGuitarAllowed = true;
    var ensembleAllowed = true;
    var padsAllowed = true;

    //Track 2
    const harp = new Soundfont(context, {
        instrument: "orchestral_harp"
    });

    harp.load.then(() => {
        console.log("Violin loaded");
    })


    //track3
    const elecPiano = new Soundfont(context, {
        instrument: "electric_grand_piano",
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
        instrument: "synth_strings_1",
    });

    ensemble1.load.then(() => {
        console.log("Ensemble loaded");
    });


    //track 6
    const pads = new Soundfont(context, {
        instrument: "pad_2_warm",
        kit: "FluidR3_GM"
    });

    pads.load.then(() => {
        console.log("Pads loaded");
    });



    var Player = new MidiPlayer.Player(function(event) {
        console.log(event);
        pads.output.setVolume(40);
        acGuitar.output.setVolume(70);
        ensemble1.output.setVolume(65);
        elecPiano.output.setVolume(70);
        harp.output.setVolume(80);

        Player.tempo = tempo;


        if (event.name == "Note on") {
            if (event.velocity == 0){
                if (event.track == 3 && harpAllowed){
                    harp.stop({note: event.noteName,time: context.currentTime});
                } else if (event.track == 4 && elecPianoAllowed){
                    elecPiano.stop({note: event.noteName,time: context.currentTime});
                } else if (event.track == 6 && ensembleAllowed){
                    ensemble1.stop({note: event.noteName,time: context.currentTime});
                } else if (event.track == 7 && padsAllowed){
                    pads.stop({note: event.noteName,time: context.currentTime});
                } else if ((event.track == 8 || event.track == 5) && acGuitarAllowed){
                    acGuitar.stop({note: event.noteName,time: context.currentTime});
                }
            } 
            if (event.track == 3 && harpAllowed){
                harp.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
            } else if (event.track == 4 && elecPianoAllowed){
                elecPiano.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
            } else if (event.track == 6 && ensembleAllowed){
                ensemble1.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
            } else if (event.track == 7 && padsAllowed){
                pads.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
            } else if ((event.track == 8 || event.track == 5) && acGuitarAllowed){
                acGuitar.start({note: event.noteName,time: context.currentTime, velocity: event.velocity});
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
        <button onClick={() => {
            padsAllowed = false
            pads.stop();
        }}>Remove pads</button>
        <button onClick={() => ensembleAllowed = false}>Remove ensemble</button>
        <button onClick={() => acGuitarAllowed = false}>Remove guitar</button>
        <button onClick={() => elecPianoAllowed = false}>Remove piano</button>
        <button onClick={() => harpAllowed = false}>Remove harp</button>
    </div>
  )
}

export default AudioTest