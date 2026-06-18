import Phaser from "phaser";

export interface weaponConfig {
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
};

export class CombatComponent {
    private scene: Phaser.Scene;
    private weaponConfig: weaponConfig

    private currentAmmo: number;
    private nextFireTime: number = 0;
    private isReloading: boolean = false;

    constructor(scene: Phaser.Scene, weaponConfig: weaponConfig) {
        this.scene = scene;
        this.weaponConfig = weaponConfig;

        this.currentAmmo = this.weaponConfig.ammo
    } 

    update(delta: number) {
        if (this.nextFireTime > 0) {
            this.nextFireTime -= delta;
        }
    }

    public shoot(): boolean {
        if (this.isReloading || this.nextFireTime > 0 || this.currentAmmo <= 0) {
            return false;
        }

        this.currentAmmo = this.currentAmmo - 1;
        this.nextFireTime = this.weaponConfig.fireRate;

        if (this.currentAmmo == 0) {
            this.scene.sound.play(this.weaponConfig.weapon_sounds.shoot[1]);
        } else {
            this.scene.sound.play(this.weaponConfig.weapon_sounds.shoot[0]);
        }

        console.log(`[COMBAT] Fired a shot! ${this.currentAmmo}/${this.weaponConfig.ammo}`);
        return true;
    }

    public reload() {
        if (this.isReloading) {
            return;
        }
        this.isReloading = true;

        const reloadAudio = this.scene.sound.add(this.weaponConfig.weapon_sounds.reload);
        reloadAudio.play();
        this.isReloading = true;
        reloadAudio.on('complete', () => {
            this.currentAmmo = this.weaponConfig.ammo;
            this.isReloading = false;
            console.log(`[RELOAD] Reload has finished`);
        });
    }

    public getCurrentAmmo(): number {
        return this.currentAmmo;
    }

    public getMaxAmmo(): number {
        return this.weaponConfig.ammo;
    }

    public getCurrentWeaponDamage(): number {
        return this.weaponConfig.damage;
    }
}