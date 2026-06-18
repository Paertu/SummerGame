import Phaser from "phaser";
import { Soldier } from "../objects/Soldier";
import { DemoGameScene } from "./DemoGameScene";
import { Squad } from "../objects/Squad";

export class SceneHud extends Phaser.Scene {
    private locationText!: Phaser.GameObjects.Text;
    private healthText!: Phaser.GameObjects.Text;
    private ammoText!: Phaser.GameObjects.Text;
    private targetSoldier!: Soldier;

    constructor() {
        super({key:"SceneHud"});
    }

    init(data: { trackingTarget: Soldier }) {
        this.targetSoldier = data.trackingTarget
    }

    create() {
        this.locationText = this.add.text(40, 40, "X: 0, Y: 0", {fontSize:'32px', fontStyle:'bold'});
        this.healthText = this.add.text(40, 80, "HP: 0", {fontSize:'32px', fontStyle:'bold'});
        this.ammoText = this.add.text(40, 120, "Ammo: --/--", {fontSize:'32px', fontStyle:'bold'});

        const gameScene = this.scene.get('DemoGameScene') as DemoGameScene;

        gameScene.events.on('hud:swapTarget', (newTarget: Soldier) => {
            this.targetSoldier = newTarget;
        });
    }

    update() {
        if (this.targetSoldier && this.targetSoldier.active) {
            const X = Math.round(this.targetSoldier.x);
            const Y = Math.round(this.targetSoldier.y);
            const hp = this.targetSoldier.currentHealth;
            const ammo = this.targetSoldier.getAmmoCount();
            const maxAmmo = this.targetSoldier.getMaxAmmoCount();

            this.locationText.setText(`${this.targetSoldier.nameCard.text} - X: ${X}, Y: ${Y}`);
            this.healthText.setText(`HP: ${hp}`);
            this.ammoText.setText(`Ammo: ${ammo}/${maxAmmo}`);
        }    
    }
}