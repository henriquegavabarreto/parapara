//This should be applicable to any song in the database(?).
//this is when ml5 calls poseNet, song starts playing and
//all the game mechanics take place.
let group;
let hitTxt;
let missTxt;
let hitCount = 0;
let missCount = 0;
let advanceSpawn = 4;
let tambourine;

let SelectedSong = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SelectedSong ()
    {
        Phaser.Scene.call(this, { key: 'selectedSong' });
    },

    preload: function ()
    {
      //Start button
      this.load.image('start', 'assets/start.png')
      //Restart button
      this.load.image('restart','assets/restart.png');
      //Visual Cues
      this.load.image('ring','assets/ring.png');
      //Song
      this.load.audio('thatsAmore','songs/thatsamore/thatsamore.mp3');
      //Sound Effects
      this.load.audio('tambourine','assets/sounds/tambourine.wav');
      //danceChart / danceMap
      //this.load.json('danceChart','songs/thatsamore.json')
    },

    create: function ()
    {
      //Add song
      song = this.sound.add('thatsAmore');

      let startButton = this.add.sprite(generalWidth/2, generalHeight/2, 'start').setInteractive();

      startButton.on('pointerdown',function(pointer){
        startCapture();
        startPoseNet(rules);
        startButton.alpha = 0;
        startButton.disableInteractive();
        setTimeout(function () {song.play() }, 3000)
      })
      //DanceChart JSON request
      var request = new XMLHttpRequest();
      request.open("GET","songs/thatsamore/thatsamore.json");
      request.responseType = 'json';
      request.send();
      request.onload = function() {
        danceChart = request.response;
        console.log("DanceChart Loaded!");
        danceChartLoaded = true;
      }

      //Graphics to show the rings in visuals
      graphics = this.add.graphics();
      songManager = new Conductor();

      //Create Rings and align them in the grid
      ringGroup = this.add.group();
      group = this.add.group({key: 'ring', frame: 0, repeat: 8, visible: true, setAlpha: 0.5});
      alignInGrid();

      //Song GUI setup
      //guiSetup();

      //Hit and Miss feedback
      hitTxt = this.add.text(100, 50, 'HIT: ' + hitCount,{ fontFamily: 'Arial', fontSize: 30, color: '#00ff00' });
      missTxt = this.add.text(100, 150, 'MISS: ' + missCount,{ fontFamily: 'Arial', fontSize: 30, color: '#00ff00' });

      //Restart button
      restart = this.add.sprite(grid[4].x,grid[4].y,'restart');
      restart.alpha = 0;
      restart.on('pointerdown',function(pointer){
        restart.alpha = 0;
        restart.disableInteractive();
        startCapture();
        song.play();
        hitCount = 0;
        missCount = 0;
        hitTxt.text = 'HIT: ' + hitCount;
        missTxt.text = 'MISS: ' + missCount;
      })

      //Error text
      errorText = this.add.text(300, 300, '',{ fontFamily: 'Arial', fontSize: 30, color: '#00ff00' });
    },

    update: function (){
      //Clear graphics and get current beat for sync purposes
      graphics.clear();
      songManager.getCurrentBeat();

      //Check where are the hands and show it through the white rings,
      //spawn rings according to the song position and Test if the hands are
      //in the place the danceChart say they're supposed to be
      if(danceChartLoaded === true){
        //placeCheck();

        cueSpawn();
        movementTests();
      }

      if(round(songManager.currentBeat) === round(song.duration/songManager.tempo) && round(songManager.currentBeat) > pastBeat){
        console.log("SONG END!");
        restart.alpha = 1;
        restart.setInteractive();
        stopCapture();
      }

      pastBeat = songManager.currentBeat;

    }

});

function alignInGrid(){
  for(let i = 0; i < grid.length; i++){
    group.children.entries[i].x = grid[i].x;
    group.children.entries[i].y = grid[i].y;
  }
}
