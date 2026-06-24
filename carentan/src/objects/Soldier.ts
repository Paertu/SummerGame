import Phaser from "phaser";
import { Bullet } from "./Bullet";
import { MovementComponent } from "../components/MovementComponent";
import { CombatComponent } from "../components/CombatComponent";
import { HealthComponent } from "../components/HealthComponent";

export class Soldier extends Phaser.GameObjects.Container {
    private bodySprite: Phaser.GameObjects.Sprite;
    private headSprite: Phaser.GameObjects.Sprite;
    private unitWeapon: Phaser.GameObjects.Sprite;
    public nameCard: Phaser.GameObjects.Text;
    public healthText: Phaser.GameObjects.Text;

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

    private health: HealthComponent;
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
        this.healthText = scene.add.text(0, this.bodySprite.displayHeight / 2 + 50, health.toString(), {fontSize: '26px', color: 'white' }).setOrigin(0.5);

        this.add([ this.unitWeapon, this.bodySprite, this.headSprite, this.healthText, this.nameCard, ]);

        scene.physics.add.existing(this);

        const physicsBody = this.body as Phaser.Physics.Arcade.Body;
        
        physicsBody.setCircle(75);
        physicsBody.setOffset(-75);

        this.movement = new MovementComponent(this, 300);
        this.combat = new CombatComponent(this.scene, this.weaponConfig);
        this.health = new HealthComponent(100);

        scene.add.existing(this)
    }

    public update(time: number, delta: number, moveUp: boolean, moveDown: boolean, moveLeft: boolean, moveRight: boolean, mouseX?: number, mouseY?: number): void {
        this.movement.update(moveUp, moveDown, moveLeft, moveRight);
        this.combat.update(delta);

        if (mouseX !== undefined && mouseY !== undefined) {
            this.rotateTowards(mouseX, mouseY);
        }
        this.updateHealthVisuals();
    }

    public rotateTowards(targetX: number, targetY: number): void {
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
        if (this.health.getCurrentHealth() > 75 && this.health.getCurrentHealth() < 100) {
            this.nameCard.setColor('#ffc400');
        }
        if (this.health.getCurrentHealth() > 1 && this.health.getCurrentHealth() < 30) {
            this.nameCard.setColor('#ff0000');
        }
    }

    public setVisbibilityState(visible: boolean): void {
        this.isHidden = !visible;
        if (visible) { 
            this.alpha = 1.0 
        } else {
            this.alpha = 0.3
        }
    }

    public shoot(): void {
        const didFire = this.combat.shoot();

        if (!didFire) {
            return;
        }

        const xOffset = this.weaponConfig.barrel_offset.x || 0;
        const yOffset = this.weaponConfig.barrel_offset.y || 0;
        const angle = this.unitWeapon.rotation;
        const damage = this.getCurrentWeaponDamage();

        const projectileSpawnX = this.x + (Math.cos(angle) * xOffset - Math.sin(angle) * yOffset);
        const projectileSpawnY = this.y + (Math.sin(angle) * xOffset + Math.cos(angle) * yOffset);

        console.log("[SHOOT DEBUG] Weapon damage:", damage);
        let bullet = (this.scene as any).bullets.create(projectileSpawnX, projectileSpawnY, angle, 'bullet') as Bullet;
        bullet.fire(angle, damage);

        console.log(`[DEBUG] ${this.nameCard.text} shot`);
    }

    public reload(): void {
        this.combat.reload();
    }

    public getAmmoCount(): number {
        return this.combat.getCurrentAmmo();
    }

    public getMaxAmmoCount(): number {
        return this.combat.getMaxAmmo();
    }

    public getCurrentWeaponDamage(): number {
        return this.combat.getCurrentWeaponDamage();
    }

    public getCurrentHealth(): number {
        return this.health.getCurrentHealth();
    }

    public takeDamage(amount: number): void{
        const isDead = this.health.reduceHealth(amount);
        this.healthText.setText(this.health.getCurrentHealth().toString());
    }
}