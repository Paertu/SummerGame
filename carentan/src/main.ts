import Phaser from "phaser";

var carentanConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var carentanGame = new Phaser.Game(carentanConfig);

function preload(this: Phaser.Scene) {
  this.load.image('grass', 'assets/grass.png');
  this.load.spritesheet('soldier', 'assets/soldier.jpg', { frameWidth: 32, frameHeight:48 });
}

function create(this: Phaser.Scene) {
  this.add.image(960, 540, 'grass');
}

function update(this: Phaser.Scene) {

}