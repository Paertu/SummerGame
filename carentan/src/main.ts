import Phaser from "phaser";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { DemoGameScene } from "./scenes/DemoGameScene";

var carentanConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y:0, x:0 },
      debugger: true
    }
  },
  scene: [ MainMenuScene, DemoGameScene ]
};

var carentanGame = new Phaser.Game(carentanConfig);
