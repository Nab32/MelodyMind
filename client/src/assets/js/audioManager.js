import MidiPlayer from 'midi-player-js';
import { SplendidGrandPiano, Soundfont } from "smplr";

export default class AudioManager {
    constructor() {
        this.player = new MidiPlayer.Player(function(event) {
            //console.log(event);
        });
        this.context = new AudioContext();
        this.loadInstruments();
        this.tempo = 120;
        
        this.player.on('fileLoaded', function() {
            console.log("FILE WAS LOADED")
        })

        this.player.on('midiEvent', (event) => {
            this.trombone.output.setVolume(127);
            this.trombone2.output.setVolume(127);

            if (event.name == "Note on"){
                if (event.track == 2){
                    this.electricPiano.start({note: event.noteNumber, time: this.context.currentTime, velocity: event.velocity});
                } else if (event.track == 3) {
                    this.mutedTrumpet.start({note: event.noteNumber, time: this.context.currentTime, velocity: event.velocity});
                } else if (event.track == 4) {
                    this.trombone.start({note: event.noteNumber, time: this.context.currentTime, velocity: event.velocity});
                    this.trombone2.start({note: event.noteNumber, time: this.context.currentTime, velocity: event.velocity});
                } else if (event.track == 5) {
                    this.tenorSaxophone.start({note: event.noteNumber, time: this.context.currentTime, velocity: event.velocity});
                } else if (event.track == 6) {
                    this.electricBass.start({note: event.noteNumber, time: this.context.currentTime, velocity: event.velocity});
                } else if (event.track == 7) {
                    this.electricGuitar.start({note: event.noteNumber, time: this.context.currentTime, velocity: event.velocity});
                } else if (event.track == 8) {
                    this.synthDrums.start({note: event.noteNumber, time: this.context.currentTime, velocity: event.velocity});
                }
            } else if (event.name == "Note off"){
                if (event.track == 2){
                    this.electricPiano.stop({note: event.noteNumber, time: this.context.currentTime});
                } else if (event.track == 3) {
                    this.mutedTrumpet.stop({note: event.noteNumber, time: this.context.currentTime});
                } else if (event.track == 4) {
                    this.trombone.stop({note: event.noteNumber, time: this.context.currentTime});
                    this.trombone2.stop({note: event.noteNumber, time: this.context.currentTime});
                } else if (event.track == 5) {
                    this.tenorSaxophone.stop({note: event.noteNumber, time: this.context.currentTime});
                } else if (event.track == 6) {
                    this.electricBass.stop({note: event.noteNumber, time: this.context.currentTime});
                } else if (event.track == 7) {
                    this.electricGuitar.stop({note: event.noteNumber, time: this.context.currentTime});
                } else if (event.track == 8) {
                    this.synthDrums.stop({note: event.noteNumber, time: this.context.currentTime});
                }
            }
        });
    }

    play() {
        this.player.play();
    }
    


    loadInstruments() {
        //Extremely long function to load all instruments needed (for now will only load enough for 1 song)
        this.electricPiano = new Soundfont(this.context, {
            instrument: "electric_grand_piano"
        })
        this.pianoVolume = 100;
        this.tenorVolume = 100;
        this.drumsVolume = 100;
        this.electricPiano.load.then(() => {
            console.log("Electric Piano loaded");
            this.electricPiano.output.setVolume(this.pianoVolume)
        });

        this.mutedTrumpet = new Soundfont(this.context, {
            instrument: "muted_trumpet"
        })
        this.mutedTrumpet.load.then(() => {
            console.log("Muted Trumpet loaded");
        });

        this.trombone = new Soundfont(this.context, {
            instrument: "trombone",
            kit: "FluidR3_GM"
        })
        this.trombone.load.then(() => {
            console.log("Trombone loaded");
        });

        this.trombone2 = new Soundfont(this.context, {
            instrument: "trombone",
            kit: "FluidR3_GM"
        })
        this.trombone2.load.then(() => {
            console.log("Trombone2 loaded");
        });

        this.tenorSaxophone = new Soundfont(this.context, {
            instrument: "tenor_sax"
        })
        this.tenorSaxophone.load.then(() => {
            console.log("Tenor Saxophone loaded");
        });

        this.electricBass = new Soundfont(this.context, {
            instrument: "electric_bass_finger"
        })
        this.electricBass.load.then(() => {
            console.log("Electric Bass loaded");
        });

        this.electricGuitar = new Soundfont(this.context, {
            instrument: "electric_guitar_jazz"
        })
        this.electricGuitar.load.then(() => {
            console.log("Electric Guitar loaded");
        });

        this.synthDrums = new Soundfont(this.context, {
            instrument: "synth_drum"
        })
        this.synthDrums.load.then(() => {
            console.log("Synth Drums loaded");
        });
    }


    loadSong(path) {
        fetch(path)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                this.player.loadArrayBuffer(arrayBuffer);
        })
    }

    changeAudio(percentage) {
        this.electricPiano.output.setVolume(this.pianoVolume * percentage);
        this.tenorSaxophone.output.setVolume(this.tenorVolume * percentage);
        this.synthDrums.output.setVolume(this.drumsVolume * percentage);
    }


    setTempo(tempo) {
        this.player.pause();
        this.player.tempo = tempo;
        this.player.play();
    }
}