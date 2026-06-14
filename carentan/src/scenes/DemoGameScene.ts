import Phaser from "phaser";
import { Squad } from "../objects/Squad";
import { Bullet } from "../objects/Bullet";

export class DemoGameScene extends Phaser.Scene {
    private squadMembers!: Squad;
    private bullets!: Phaser.Physics.Arcade.Group;
    
    constructor() {
        super({key: 'DemoGameScene' });
    }

    preload() {
        this.load.json('kitData', 'assets/data/weapons.json');

        this.load.image('grass', 'assets/grass.png');
        this.load.image('soldier', 'assets/soldier.jpg');

        this.load.image('bodyTexture', 'assets/sprites/units/alliedUnits/allied_soldier_torso_1.png');
        this.load.image('headTexture', 'assets/sprites/units/alliedUnits/allied_soldier_head_1.png');

        this.load.image('anim_garand', 'assets/sprites/weapons/m1garand.png');
        this.load.image('anim_thompson', 'assets/sprites/weapons/thompson.png');

        this.load.image('bullet', 'assets/sprites/bullet.png');

        //AUDIO
        this.load.audio('shoot_thompson', 'assets/sfx/thompson_fire.mp3');
        this.load.audio('reload_thompson', 'assets/sfx/thompson_reload.mp3');

        this.load.audio('shoot_garand', 'assets/sfx/garand_fire.mp3');
        this.load.audio('reload_garand', 'assets/sfx/garand_reload.mp3');
    }

    create() {
        const kitData = this.cache.json.get('kitData');
        this.bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });
        
        this.add.tileSprite(960, 540, 1920, 1080, 'grass');

        this.squadMembers = new Squad(this);

        this.squadMembers.spawn([
            { x: 960, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Sgt. Foley", kit: "rifler", health: 100},
            { x: 960, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Pvt. Riley", kit: "submachinegunner", health: 100}
        ], kitData);
    }

    update(time: number, delta: number) {
        this.squadMembers.update(time, delta);
    }
}