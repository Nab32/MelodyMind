import MidiPlayer from 'midi-player-js';
import { SplendidGrandPiano, Soundfont } from "smplr";
import data from "../data/songs.json"

export default class AudioManager {
    constructor() {
        this.player = new MidiPlayer.Player(function(event) {
            //console.log(event);
        });
        this.context = new AudioContext();
        this.wantedTempo = 0;
        
        this.player.on('fileLoaded', function() {
            console.log("FILE WAS LOADED");
        })

        this.player.on('midiEvent', (event) => {
            if (this.instruments["track" + event.track]) {
                if (event.name == "Note on") {
                    this.instruments["track" + event.track].start({note: event.noteName, time: this.context.currentTime, velocity: event.velocity});
                } else if (event.name == "Note off") {
                    this.instruments["track" + event.track].stop({note: event.noteNumber, time: this.context.currentTime});
                }
            }
        });
    }

    play() {
        this.player.play();
    }
    


    loadInstruments(songID) {
        //Extremely long function to load all instruments needed (for now will only load enough for 1 song)
        this.instruments = {};

        const song = data.songs.find(song => song.songId == songID);

        if (!song) {
            return console.log("Song not found");
        }

        this.wantedTempo = song.tempo;

        song.instruments.map((instrument, i) => {
            //first track is constructor
            const skipToFirstTrack = 2;
            this.instruments["track" + (i + skipToFirstTrack)] = new Soundfont(this.context, {
                instrument: instrument.name,
                kit: "FluidR3_GM"
            });
            this.instruments["track" + (i + skipToFirstTrack)].load.then(() => {
                console.log(instrument.name + " loaded");
                this.instruments["track" + (i + skipToFirstTrack)].output.setVolume(instrument.volume);
            })
        })
        console.log(this.instruments);
    }

    loadSong(path, songID) {
        fetch(path)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                this.player.loadArrayBuffer(arrayBuffer);
                this.loadInstruments(songID);
        })
    }

    setTempo(tempo) {
        this.player.pause();
        this.player.tempo = tempo;
        this.player.play();
    }

    getInstrumentNames() {
    }
}