import { Soldier } from "../objects/Soldier";
import Phaser from "phaser";

export class AIComponent {
    private host: Soldier;
    private scene: any;
    private keepDistance: number;

    constructor(host: Soldier, scene:any, keepDistance: number = 200) {
        this.host = host;
        this.scene = scene;
        this.keepDistance = keepDistance;
    }

    public update(): void {
        const targets = this.scene.squadMembers.getAllSprites() as Soldier[];
        let closestTarget: Soldier | null = null;
        let closestDistance = Infinity;

        targets.forEach((soldier) => {
            if (this.scene.hasLineOfSight(this.host, soldier)) {
                const distance = Phaser.Math.Distance.Between(this.host.x, this.host.y, soldier.x, soldier.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestTarget = soldier;
                }
            }
        });

        if (closestTarget) {
            const closestValidTarget = closestTarget as Soldier
            this.host.rotateTowards(closestValidTarget.x, closestValidTarget.y);
            this.host.emit('lookAt', closestValidTarget.x, closestValidTarget.y);

            const dx = closestValidTarget.x - this.host.x;
            const dy = closestValidTarget.y - this.host.y;
            const distance = Phaser.Math.Distance.Between(this.host.x, this.host.y, closestValidTarget.x, closestValidTarget.y);

            if (distance <= this.keepDistance) {
                this.stop();
                return;
            }

            const moveLeft = dx < -10;
            const moveRight = dx > 10;
            const moveUp = dy < - 10;
            const moveDown = dy > 10;

            this.host.emit('move', moveUp, moveDown, moveLeft,moveRight);
        } else {
            this.stop();
        }
    }

    private stop(): void {
        this.host.emit('move', false, false, false, false);
    }
}