import Phaser from "phaser";

export class Soldier extends Phaser.GameObjects.Container {
    private sprite: Phaser.GameObjects.Sprite;
    private unitWeapon: Phaser.GameObjects.Sprite;
    private nameCard: Phaser.GameObjects.Text;
    public isHidden: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string, kit: string, health: integer) {
        super(scene, x, y);

        this.unitWeapon = scene.add.sprite(0, 0, kit).setOrigin(0.3, 0.5);
        this.unitWeapon.displayHeight = 150;
        this.unitWeapon.displayWidth = 300;

        this.sprite = scene.add.sprite(0, 0, texture);
        this.sprite.displayHeight = 200;
        this.sprite.displayWidth = 125;

        this.nameCard = scene.add.text(0, this.sprite.displayHeight / 2 + 20, name, {fontSize: '26px', color: 'white' }).setOrigin(0.5);

        this.add([ this.sprite, this.nameCard, this.unitWeapon,]);

        scene.physics.add.existing(this);

        scene.add.existing(this)
    }

    public rotateTowards(targetX: number, targetY: number) {
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);

        const rotationSpeed = 0.009;

        this.sprite.rotation = Phaser.Math.Angle.RotateTo(
            this.sprite.rotation,
            targetAngle,
            rotationSpeed
        );

        this.unitWeapon.rotation = Phaser.Math.Angle.RotateTo(
            this.unitWeapon.rotation,
            targetAngle,
            rotationSpeed - 0.003
        )
    }

    public healthCheck(health: integer) {
        if (health > 75) {
            this.nameCard.setColor('red');
        }
    }

    public shoot() {
        console.log(`[COMBAT] ${this.nameCard.text} SHOT`);
    }

    public setVisbibilityState(visible: boolean) {
        this.isHidden = !visible;
        if (visible) { 
            this.alpha = 1.0 
        } else {
            this.alpha = 0.3
        }
    }
}