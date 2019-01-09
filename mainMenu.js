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
      let startButton = this.add.sprite(generalWidth/2, 600, 'start').setInteractive();

      startButton.on('pointerdown',function(pointer){
        game.scene.start('songSelect');
        game.scene.stop('mainMenu');
      })

      this.add.text(300, 100, 'This is just a test. Please support eurobeat artists.\r\r          Best if played using google chrome.',{ fontFamily: 'Arial', fontSize: 30, color: '#ffffff', });
      this.add.text(250, 250, 'This experiment uses your front camera, so make sure\ryou have one and that it is enabled on your browser settings.\rYou can check that to the left of the web address, where you \rsee a lock and say we\'re allowed :)\rWe\'re using sound too. Make sure your speakers are on and\rsound is enabled for this website.\rAlso, make sure your browser is set to use hardware acceleration\rwhen available.',{ fontFamily: 'Arial', fontSize: 30, color: '#ffffff', });
    }

});
