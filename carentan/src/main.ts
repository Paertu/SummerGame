import Phaser from "phaser";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { DemoGameScene } from "./scenes/DemoGameScene";
import { SceneHud } from "./scenes/SceneHud";

var carentanConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y:0, x:0 },
      debug: true,
    }
  },
  scene: [ MainMenuScene, DemoGameScene, SceneHud ]
};

var carentanGame = new Phaser.Game(carentanConfig);
