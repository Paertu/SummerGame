import { event } from "@tauri-apps/api";
import Phaser from "phaser";

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'MainMenuScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.text(width / 2, height / 2 - 100, "CARENTAN", { fontSize: '96px' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2 + 50, "Press Any Key To Start", { fontSize: '64px' }).setOrigin(0.5);

        this.input.keyboard!.once('keydown', (event: KeyboardEvent) => {
            this.scene.start('DemoGameScene');
            console.log(`[SCENE] Detected input from key ${event.key.toUpperCase()}, starting game.`);
        });
    }
}