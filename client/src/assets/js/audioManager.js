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
    
    getSongPercent() {
        return this.player.getSongPercentRemaining();
    }

    loadInstruments(songID) {
        this.instruments = {};
    
        const song = data.songs.find(song => song.songId == songID);
    
        if (!song) {
            return console.log("Song not found");
        }
    
        this.wantedTempo = song.tempo;
    
        // Create an array of promises for loading instruments
        const loadPromises = song.instruments.map((instrument, i) => {
            const skipToFirstTrack = 2;
            const trackName = "track" + (i + skipToFirstTrack);
            this.instruments[trackName] = new Soundfont(this.context, {
                instrument: instrument.name,
                kit: "FluidR3_GM"
            });
    
            return this.instruments[trackName].load.then(() => {
                console.log(instrument.name + " loaded");
                this.instruments[trackName].output.setVolume(instrument.volume);
            });
        });
    
        // Return a promise that resolves when all instruments are loaded
        return Promise.all(loadPromises).then(() => {
            console.log(this.instruments);
        });
    }

    async loadSong(path, songID) {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        this.player.loadArrayBuffer(arrayBuffer);
        
        await this.loadInstruments(songID);  // Wait for instruments to load
    }

    setTempo(tempo) {
        this.player.pause();
        this.player.tempo = tempo;
        this.player.play();
    }

    getInstrumentNames() {
    }
}