import Phaser from "phaser";
import { Bullet } from "./Bullet";
import { MovementComponent } from "../components/MovementComponent";
import { CombatComponent } from "../components/CombatComponent";

export class Soldier extends Phaser.GameObjects.Container {
    private bodySprite: Phaser.GameObjects.Sprite;
    private headSprite: Phaser.GameObjects.Sprite;
    private unitWeapon: Phaser.GameObjects.Sprite;
    public nameCard: Phaser.GameObjects.Text;

    public currentHealth: number = 100;
    public isHidden: boolean = false;

    private nextFireTime: number = 0;
    private isReady: boolean = true;

    public weaponConfig: {
        main_weapon: string;
        texture: string;
        fireRate: number;
        damage: number;
        ammo: number;
        barrel_offset: { x: number, y: number };
        weapon_sounds: {
            shoot: string[];
            reload: string
        };
        current_ammo: number;
    };

    private movement: MovementComponent;
    private combat: CombatComponent;

    constructor(scene: Phaser.Scene, 
        x: number, 
        y: number, 
        bodyTexture: string, 
        headTexture: string, 
        name: string, 
        health: number, 
        weaponConfig: any
    ) {
        super(scene, x, y);

        this.currentHealth = health;
        this.weaponConfig = weaponConfig;

        this.unitWeapon = this.scene.add.sprite(0, 0, this.weaponConfig.texture).setOrigin(0.1, 0.2);
        this.unitWeapon.displayHeight = 150;
        this.unitWeapon.displayWidth = 300;

        this.bodySprite = this.scene.add.sprite(0, 0, bodyTexture);
        this.bodySprite.displayHeight = 200;
        this.bodySprite.displayWidth = 125;

        this.headSprite = this.scene.add.sprite(0, 0, headTexture);
        this.headSprite.displayHeight = 200;
        this.headSprite.displayWidth = 125;

        this.nameCard = scene.add.text(0, this.bodySprite.displayHeight / 2 + 20, name, {fontSize: '26px', color: 'white' }).setOrigin(0.5);

        this.add([ this.nameCard, this.unitWeapon, this.bodySprite, this.headSprite,]);

        scene.physics.add.existing(this);

        const physicsBody = this.body as Phaser.Physics.Arcade.Body;
        
        physicsBody.setCircle(75);
        physicsBody.setOffset(-75);

        this.movement = new MovementComponent(this, 300);
        this.combat = new CombatComponent(this.scene, this.weaponConfig);

        scene.add.existing(this)
    }

    public update(time: number, delta: number, moveUp: boolean, moveDown: boolean, moveLeft: boolean, moveRight: boolean, mouseX?: number, mouseY?: number) {
        this.movement.update(moveUp, moveDown, moveLeft, moveRight);
        this.combat.update(delta);

        if (mouseX !== undefined && mouseY !== undefined) {
            this.rotateTowards(mouseX, mouseY);
        }
        this.updateHealthVisuals();
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

    public setVisbibilityState(visible: boolean) {
        this.isHidden = !visible;
        if (visible) { 
            this.alpha = 1.0 
        } else {
            this.alpha = 0.3
        }
    }

    public shoot() {
        const didFire = this.combat.shoot();

        if (!didFire) {
            return;
        }

        const xOffset = this.weaponConfig.barrel_offset.x || 0;
        const yOffset = this.weaponConfig.barrel_offset.y || 0;
        const angle = this.unitWeapon.rotation;

        const projectileSpawnX = this.x + (Math.cos(angle) * xOffset - Math.sin(angle) * yOffset);
        const projectileSpawnY = this.y + (Math.sin(angle) * xOffset + Math.cos(angle) * yOffset);

        let bullet = (this.scene as any).bullets.create(projectileSpawnX, projectileSpawnY, angle, 'bullet') as Bullet;
        bullet.fire(angle);

        console.log(`[DEBUG] ${this.nameCard.text} shot`);
    }

    public reload() {
        this.combat.reload();
    }

    public getAmmoCount(): number {
        return this.combat.getCurrentAmmo();
    }

    public getMaxAmmoCount(): number {
        return this.combat.getMaxAmmo();
    }
}