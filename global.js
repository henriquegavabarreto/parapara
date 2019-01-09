let danceChartLoaded = false;
let rightHandTxt;
let leftHandTxt;
let ringGroup;
let errorText;

let gui;
let song;
let index = 0;
let checkIndex = 0;
let danceChart;
let songManager;
let pastBeat;
let graphics;

let cueParticles;

function guiSetup(){
  gui = new dat.GUI();

  var sm = gui.addFolder('Song Control');
  sm.add(song, 'seek', 0, song.duration).step(0.01).listen();
  sm.add(song, 'play');
  sm.add(song, 'pause');
  sm.add(song, 'resume');
  sm.add(song, 'stop');
  sm.add(songManager, 'currentBeat', 0, song.duration/songManager.tempo).step(1).listen();
  //sm.open();
}

function Conductor(){
  this.bpm = 158;
  this.tempo = 60/this.bpm;
  this.currentBeat = 0;

  this.getCurrentBeat = function(){
    this.currentBeat = song.seek/this.tempo;
  }
}

function round(value) {
    return Math.round(value * 4) / 4;
}
