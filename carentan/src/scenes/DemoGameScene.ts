import Phaser from "phaser";
import { Squad } from "../objects/Squad";

export class DemoGameScene extends Phaser.Scene {
    private squadMembers!: Squad;
    
    constructor() {
        super({key: 'DemoGameScene' });
    }

    preload() {
        this.load.image('grass', 'assets/grass.png');
        this.load.image('soldier', 'assets/soldier.jpg');

        this.load.image('bodyTexture', 'assets/sprites/units/alliedUnits/allied_soldier_torso_1.png');
        this.load.image('headTexture', 'assets/sprites/units/alliedUnits/allied_soldier_head_1.png');

        this.load.image('rifler', 'assets/sprites/weapons/m1garand.png');
        this.load.image('submachinegunner', 'assets/sprites/weapons/thompson.png');
    }

    create() {
        this.add.tileSprite(960, 540, 1920, 1080, 'grass');

        this.squadMembers = new Squad(this);

        this.squadMembers.spawn([
            { x: 960, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Foley", kit: "rifler", health: 25 },
            { x: 960, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Emily", kit: "submachinegunner", health: 100 },
        ]);
    }

    update() {
        this.squadMembers.update();
    }
}