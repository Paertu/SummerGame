import Phaser, { Physics } from "phaser";

let squad: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
let activeCharacterIndex: number = 0;

let movementKeys: {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

var carentanConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y:0, x:0 },
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var carentanGame = new Phaser.Game(carentanConfig);

function preload(this: Phaser.Scene) {
  this.load.image('grass', 'assets/grass.png');
  this.load.image('soldier', 'assets/soldier.jpg');
}

function create(this: Phaser.Scene) {
  this.add.tileSprite(960, 540, 1920, 1080, 'grass');

  const squadSpawnData = [
    { x: 960, y:540, texture: 'soldier', scale: 0.05 }
  ]

  squadSpawnData.forEach((data) => {
    let newUnit = this.physics.add.sprite(data.x, data.y, data.texture);
    newUnit.setScale(data.scale);
    squad.push(newUnit);
  })

  movementKeys = this.input.keyboard!.addKeys({
    W: Phaser.Input.Keyboard.KeyCodes.W,
    A: Phaser.Input.Keyboard.KeyCodes.A,
    S: Phaser.Input.Keyboard.KeyCodes.S,
    D: Phaser.Input.Keyboard.KeyCodes.D
  }) as any;
}

function update(this: Phaser.Scene) {
  let currentCharacter = squad[activeCharacterIndex];

  if (!currentCharacter) return;

  currentCharacter.setVelocity(0);

  if (movementKeys.W.isDown) {
    currentCharacter.setVelocityY(-300);
  }
  if (movementKeys.S.isDown) {
    currentCharacter.setVelocityY(300);
  }
  
  if (movementKeys.A.isDown) {
    currentCharacter.setVelocityX(-300);
  }  
  if (movementKeys.D.isDown) {
    currentCharacter.setVelocityX(300);
  }
}