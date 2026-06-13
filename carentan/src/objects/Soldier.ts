import Phaser from "phaser";

export class Soldier extends Phaser.GameObjects.Container {
    private bodySprite: Phaser.GameObjects.Sprite;
    private headSprite: Phaser.GameObjects.Sprite;
    private unitWeapon: Phaser.GameObjects.Sprite;
    private nameCard: Phaser.GameObjects.Text;
    private currentHealth: number = 100;
    public isHidden: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, bodyTexture: string, headTexture: string, name: string, kit: string, health: number) {
        super(scene, x, y);

        this.currentHealth = health;

        this.unitWeapon = scene.add.sprite(0, 0, kit).setOrigin(0.1, 0.2);
        this.unitWeapon.displayHeight = 150;
        this.unitWeapon.displayWidth = 300;

        this.bodySprite = scene.add.sprite(0, 0, bodyTexture);
        this.bodySprite.displayHeight = 200;
        this.bodySprite.displayWidth = 125;

        this.headSprite = scene.add.sprite(0, 0, headTexture);
        this.headSprite.displayHeight = 200;
        this.headSprite.displayWidth = 125;

        this.nameCard = scene.add.text(0, this.bodySprite.displayHeight / 2 + 20, name, {fontSize: '26px', color: 'white' }).setOrigin(0.5);

        this.add([ this.nameCard, this.unitWeapon, this.bodySprite, this.headSprite,]);

        scene.physics.add.existing(this);

        scene.add.existing(this)
    }

    public rotateTowards(targetX: number, targetY: number) {
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);

        const rotationSpeed = 0.04;

        this.bodySprite.rotation = Phaser.Math.Angle.RotateTo(
            this.bodySprite.rotation,
            targetAngle,
            rotationSpeed - 0.02
        );

        this.headSprite.rotation = Phaser.Math.Angle.RotateTo(
            this.headSprite.rotation,
            targetAngle,
            rotationSpeed
        );

        this.unitWeapon.rotation = Phaser.Math.Angle.RotateTo(
            this.unitWeapon.rotation,
            targetAngle,
            rotationSpeed - 0.025
        )
    }

    public updateHealthVisuals() {
        if (this.currentHealth > 75 && this.currentHealth < 100) {
            this.nameCard.setColor('#ffc400');
        }
        if (this.currentHealth > 1 && this.currentHealth < 30) {
            this.nameCard.setColor('#ff0000');
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