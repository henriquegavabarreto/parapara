//This scene should be able to load all interactive
//images according to number of songs/stepcharts/banners
//on database.
//Should I try using Rails?
let SongSelect = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SongSelect ()
    {
        Phaser.Scene.call(this, { key: 'songSelect' });
    },

    preload: function ()
    {
      //Add Instructions
      this.load.image('instructions','assets/instructions.png');
      this.load.image('amore', 'assets/amore.png');
      //this.load.image('start', 'assets/start.png');
    },

    create: function ()
    {
      let amore = this.add.sprite(generalWidth/2,500,'amore').setInteractive();
      //let startButton = this.add.sprite(400, 500, 'start').setInteractive();
      this.add.image(generalWidth/2,200,'instructions')

      amore.on('pointerdown',function(pointer){
        game.scene.start('selectedSong');
        game.scene.stop('songSelect')
      });

      // startButton.on('pointerdown',function(){
      //   game.scene.start('danceEditor');
      //   game.scene.stop('songSelect');
      // })

    },

    update: function ()
    {
    }

});
