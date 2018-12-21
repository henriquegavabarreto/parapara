//Main menu to adjust game preferences and set start
let MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: 'mainMenu' });
    },

    preload: function ()
    {
        this.load.image('start', 'assets/start.png');
    },

    create: function ()
    {
      let startButton = this.add.sprite(generalWidth/2, generalHeight/2, 'start').setInteractive();

      startButton.on('pointerdown',function(pointer){
        game.scene.start('songSelect');
        game.scene.stop('mainMenu');
      })

      this.add.text(350, 150, 'This is just a test. Please support eurobeat artists.',{ fontFamily: 'Arial', fontSize: 30, color: '#ffffff', });

    }

});
