import Phaser from "phaser";
import { Soldier } from "./Soldier";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    private bulletVelocity: number = 2500;
    private bulletDamage: number = 0;
    constructor(scene: Phaser.Scene, x: number, y:  number, angle: number, texture: string) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        scene.physics.add.existing(this);
    }

    update() {
        if (this.x < 0 || this.x > 1920 || this.y < 0 || this.y > 1080) {
            console.log("[COMBAT] Bullet left the bounds");
            this.destroy();
        } else {
            
        }
    }

    public fire(angle: number, damage: number) {
        this.rotation = angle;
        this.bulletDamage = damage;
        const angleInDegrees = Phaser.Math.RadToDeg(angle);
        (this.scene.physics as any).velocityFromAngle(angleInDegrees, this.bulletVelocity, (this.body as Phaser.Physics.Arcade.Body).velocity);
    }

    public getCurrentBulletDamage() {
        return this.bulletDamage;
    }
}