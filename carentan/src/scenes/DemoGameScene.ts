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
        this.load.image('soldier2', 'assets/soldier2.png');
        this.load.image('soldier3', 'assets/soldier3.png');
        this.load.image('rifler', 'assets/m1garand.png');
        this.load.image('submachinegunner', 'assets/thompson.png');
    }

    create() {
        this.add.tileSprite(960, 540, 1920, 1080, 'grass');

        this.squadMembers = new Squad(this);

        this.squadMembers.spawn([
            { x: 960, y: 540, texture: 'soldier', name: "Jade", kit: "rifler", health: 100 },
            { x: 760, y: 540, texture: 'soldier2', name: "Foley", kit: "submachinegunner", health: 100},
            { x: 460, y: 540, texture: 'soldier3', name: "Kalash", kit: "rifler", health: 100 }
        ]);
    }

    update() {
        this.squadMembers.update();
    }
}