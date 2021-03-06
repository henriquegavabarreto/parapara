//Phaser Game configurations
const generalWidth = 1280;
const generalHeight = 720;

var config = {
    type: Phaser.AUTO,
    width: generalWidth,
    height: generalHeight,
    backgroundColor: '#000000',
    fps: { min: 30, target: 60 },
    scene: [ MainMenu, SongSelect, SelectedSong]
};

var game = new Phaser.Game(config);
