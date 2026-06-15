import Phaser from "phaser";
import { Bullet } from "./Bullet";
import { } from "../helpers/combatHelpers";

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

        this.unitWeapon = scene.add.sprite(0, 0, this.weaponConfig.texture).setOrigin(0.1, 0.2);
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

        const physicsBody = this.body as Phaser.Physics.Arcade.Body;
        physicsBody.setCircle(75);
        physicsBody.setOffset(-75);

        scene.add.existing(this)
    }

    public update(time: number, delta: number) {
        if (this.nextFireTime > 0) {
            this.nextFireTime -= delta;
        }
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
        if (this.isReady === false || this.nextFireTime > 0) return;
        if (this.handleOutOfAmmo()) return;
        
        this.fireWeapon();

        this.playWeaponSounds();

        this.weaponConfig.current_ammo = this.weaponConfig.current_ammo - 1;
        this.nextFireTime = this.weaponConfig.fireRate;
    }

    public reload() {
        const reloadAudio = this.scene.sound.add(this.weaponConfig.weapon_sounds.reload);
        console.log(`[COMBAT DEBUG] Pressed R`);
        reloadAudio.play();
        this.isReady = false;
        reloadAudio.on('complete', () => {
            console.log(`[RELOAD] Reload has finished`);
            this.weaponConfig.current_ammo = this.weaponConfig.ammo;
            this.isReady = true;
        });
    }

    public setVisbibilityState(visible: boolean) {
        this.isHidden = !visible;
        if (visible) { 
            this.alpha = 1.0 
        } else {
            this.alpha = 0.3
        }
    }

    private handleOutOfAmmo(): boolean {
        if (this.weaponConfig.current_ammo <= 0) {
            console.log(`[AMMO] ${this.nameCard.text} ran out of ammo`);
            this.isReady = false;
            return true;
        }
        return false;
    }

    private fireWeapon() {
        console.log(`[COMBAT] ${this.nameCard.text} SHOT`);
        console.log(`${this.weaponConfig.barrel_offset}`);
        const xOffset = this.weaponConfig.barrel_offset.x || 0;
        const yOffset = this.weaponConfig.barrel_offset.y || 0;
        console.log(`xOffset: ${xOffset}, yOffset: ${yOffset}`);
        const angle = this.unitWeapon.rotation;

        const projectileSpawnX = this.x + (Math.cos(angle) * xOffset - Math.sin(angle) * yOffset);
        const projectileSpawnY = this.y + (Math.sin(angle) * xOffset + Math.cos(angle) * yOffset);

        let bullet = (this.scene as any).bullets.create(projectileSpawnX, projectileSpawnY, angle, 'bullet') as Bullet;
        bullet.fire(angle);

        console.log(`[COMBAT] Ammo: ${this.weaponConfig.current_ammo}`);
    }

    private playWeaponSounds() {
        const shootAudio = this.weaponConfig.weapon_sounds.shoot;
        if (this.weaponConfig.current_ammo == 1) {
            this.scene.sound.play(this.weaponConfig.weapon_sounds.shoot[1]);
        } else {
            this.scene.sound.play(this.weaponConfig.weapon_sounds.shoot[0]);
        }

        if (shootAudio) {
            console.log(`[AUDIO DEBUG] Shoot: ${shootAudio}`);
        }
    }
}