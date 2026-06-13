import Phaser, { Physics } from "phaser";

let squad: any[] = [];
let activeCharacterIndex: number = 0;

let actionKeys: {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
  CHARSWAP: Phaser.Input.Keyboard.Key;
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
  this.load.image('soldier2', 'assets/soldier2.png');
  this.load.image('soldier3', 'assets/soldier3.png');
}

function create(this: Phaser.Scene) {
  this.add.tileSprite(960, 540, 1920, 1080, 'grass');

  const squadSpawnData = [
    { x: 960, y:540, texture: 'soldier', scale: 0.05, name: "Jade" },
    { x: 760, y:540, texture: 'soldier2', scale: 0.27, name: "Foley" },
    { x: 460, y:540, texture: 'soldier3', scale: 0.03, name: "Kalash" }
  ]

  squadSpawnData.forEach((data) => {
    let unitSprite = this.add.sprite(0, 0, data.texture);
    unitSprite.setScale(data.scale);

    let unitNameCard = this.add.text(0, unitSprite.displayHeight / 2 + 10, data.name, {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    let playerContainer = this.add.container(data.x, data.y, [unitSprite, unitNameCard]);

    this.physics.add.existing(playerContainer);

    squad.push(playerContainer);
  })

  actionKeys = this.input.keyboard!.addKeys({
    W: Phaser.Input.Keyboard.KeyCodes.W,
    A: Phaser.Input.Keyboard.KeyCodes.A,
    S: Phaser.Input.Keyboard.KeyCodes.S,
    D: Phaser.Input.Keyboard.KeyCodes.D,
    CHARSWAP: Phaser.Input.Keyboard.KeyCodes.SPACE
  }) as any;
}

function update() {
  if (Phaser.Input.Keyboard.JustDown(actionKeys.CHARSWAP)) {
    if (squad[activeCharacterIndex]) {
      (squad[activeCharacterIndex].body as Phaser.Physics.Arcade.Body).setVelocity(0);
    }
    activeCharacterIndex = (activeCharacterIndex + 1) % squad.length;
    console.log("[CHARACTER ACTION] Swapped to character index:", activeCharacterIndex);
  }

  let currentCharacter = squad[activeCharacterIndex];
  if (!currentCharacter) return;

  let body = currentCharacter.body as Phaser.Physics.Arcade.Body;

  body.setVelocity(0);

  if (actionKeys.W.isDown) {
    body.setVelocityY(-300);
  }
  if (actionKeys.S.isDown) {
    body.setVelocityY(300);
  }
  
  if (actionKeys.A.isDown) {
    body.setVelocityX(-300);
  }  
  if (actionKeys.D.isDown) {
    body.setVelocityX(300);
  }
}