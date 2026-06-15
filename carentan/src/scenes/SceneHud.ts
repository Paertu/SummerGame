import Phaser from "phaser";
import { Soldier } from "../objects/Soldier";
import { DemoGameScene } from "./DemoGameScene";

export class SceneHud extends Phaser.Scene {
    private locationText!: Phaser.GameObjects.Text;
    private targetSoldier!: Soldier;

    constructor() {
        super({key:"SceneHud"});
    }

    init(data: { trackingTarget: Soldier }) {
        this.targetSoldier = data.trackingTarget
    }

    create() {
        this.locationText = this.add.text(40, 40, "X: 0, Y: 0", {fontSize:'32px', fontStyle:'bold'});

        const gameScene = this.scene.get('DemoGameScene') as DemoGameScene;

        gameScene.events.on('hud:swapTarget', (newTarget: Soldier) => {
            this.targetSoldier = newTarget;
        });
    }

    update() {
        if (this.targetSoldier && this.targetSoldier.active) {
            const X = Math.round(this.targetSoldier.x);
            const Y = Math.round(this.targetSoldier.y);

            this.locationText.setText(`${this.targetSoldier.nameCard.text} - X: ${X}, Y: ${Y}`);
        }    
    }
}