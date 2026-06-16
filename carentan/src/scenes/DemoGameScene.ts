import Phaser from "phaser";
import { Squad } from "../objects/Squad";
import { Bullet } from "../objects/Bullet";
import { Soldier } from "../objects/Soldier";

export class DemoGameScene extends Phaser.Scene {
    private squadMembers!: Squad;
    private enemies!: Squad;
    public soldier!: Soldier;
    private bullets!: Phaser.Physics.Arcade.Group;
    
    constructor() {
        super({key: 'DemoGameScene' });
    }

    preload() {
        this.load.json('kitData', 'assets/data/weapons.json');

        this.load.image('grass', 'assets/grass.png');
        this.load.image('soldier', 'assets/soldier.jpg');

        //ALLIES

        this.load.image('bodyTexture', 'assets/sprites/units/alliedUnits/allied_soldier_torso_1.png');
        this.load.image('headTexture', 'assets/sprites/units/alliedUnits/allied_soldier_head_1.png');

        this.load.spritesheet('anim_garand', 'assets/sprites/weapons/m1garand.png', {frameWidth: 300, frameHeight: 150, startFrame: 0, endFrame: 0});
        this.load.spritesheet('anim_thompson', 'assets/sprites/weapons/anim_thompson.png', {frameWidth: 300, frameHeight: 150, startFrame: 0, endFrame: 3});

        this.load.image('bullet', 'assets/sprites/weapons/gun_shell.png');

        //AUDIO
        this.load.audio('shoot_thompson', 'assets/sfx/thompson_fire.mp3');
        this.load.audio('shoot_thompson_last', 'assets/sfx/thompson_fire.mp3');
        this.load.audio('reload_thompson', 'assets/sfx/thompson_reload.mp3');

        this.load.audio('shoot_garand', 'assets/sfx/garand_fire.mp3');
        this.load.audio('shoot_garand_last', 'assets/sfx/garand_ping.mp3');
        this.load.audio('reload_garand', 'assets/sfx/garand_reload.mp3');

        // AXIS

        this.load.image('bodyPlaceholder', 'assets/soldier.jpg');
        this.load.image('headPlaceholder', 'assets/soldier.jpg');
    }

    create() {
        const kitData = this.cache.json.get('kitData');

        Object.keys(kitData).forEach(kitKey => {
            const kit = kitData[kitKey];
            const anims = kit.animations;

            if (anims) {
                this.anims.create({
                    key:`${kit.texture}_shoot`,
                    frames: this.anims.generateFrameNumbers(kit.texture, { start: anims.shoot.start, end: anims.shoot.end}),
                    frameRate: anims.shoot.fps,
                    repeat: -1
                });

                this.anims.create({
                    key:`${kit.texture}_default`,
                    frames: this.anims.generateFrameNumbers(kit.texture, { start: anims.default.start, end: anims.default.end}),
                    frameRate: anims.shoot.fps,
                    repeat: -1
                });
            }
        });

        this.bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });
        
        this.add.tileSprite(3000, 2000, 6000, 4000, 'grass');

        this.squadMembers = new Squad(this);

        this.squadMembers.spawn([
            { x: 790, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Sgt. Foley", kit: "rifler", health: 100},
            { x: 1000, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Pvt. Riley", kit: "submachinegunner", health: 100},
            { x: 860, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Cpl. Miller", kit: "rifler", health: 100}
        ], kitData);

        this.enemies = new Squad(this);

        this.enemies.spawn([
            { x: 235, y: 560, bodyTexture: 'bodyPlaceholder', headTexture: 'headPlaceholder', name: "Meanie 1", kit: "rifler", health: 100},
            { x: 300, y: 660, bodyTexture: 'bodyPlaceholder', headTexture: 'headPlaceholder', name: "Meanie 2", kit: "submachinegunner", health: 100}
        ], kitData);

        const initialSoldier = this.squadMembers.getAllSprites()
        const enemyArray = this.enemies.getAllSprites();

        enemyArray.forEach(singleVictim => {
            this.physics.add.overlap(this.bullets, singleVictim, (victim, bullet) => {
                console.log(`[DEBUG] SHOT ENEMY: ${singleVictim.nameCard.text}`);

                bullet.destroy();
                this.enemies.removeFromSquad(singleVictim);
                singleVictim.destroy();
            })
        });

        initialSoldier.forEach(singleVictim => {
            this.physics.add.overlap(this.bullets, singleVictim, (victim, bullet) => {
                console.log(`[DEBUG] SHOT FRIENDLY: ${singleVictim.nameCard.text}`);

                bullet.destroy();
                this.squadMembers.removeFromSquad(singleVictim);
                singleVictim.destroy();
            })
        });

        this.scene.launch('SceneHud', { trackingTarget: initialSoldier});
    }

    update(time: number, delta: number) {
        this.squadMembers.update(time, delta);
    }
}