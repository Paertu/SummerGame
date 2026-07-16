import Phaser, { GameObjects } from "phaser";
import { Squad } from "../objects/Squad";
import { Bullet } from "../objects/Bullet";
import { Soldier } from "../objects/Soldier";

export class DemoGameScene extends Phaser.Scene {
    private squadMembers!: Squad;
    private enemies!: Squad;
    public soldier!: Soldier;
    private bullets!: Phaser.Physics.Arcade.Group;
    private obstacles!: Phaser.Physics.Arcade.StaticGroup;
    private enemyBullets!: Phaser.Physics.Arcade.Group;
    private debugGraphics!: Phaser.GameObjects.Graphics;
    
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
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.setDepth(1000);

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

        this.enemyBullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });
        
        this.add.tileSprite(3000, 2000, 6000, 4000, 'grass');

        this.obstacles = this.physics.add.staticGroup();

        const wall1 = this.add.rectangle(600, 500, 50, 400, 0x555555);
        const wall2 = this.add.rectangle(800, 700, 400, 50, 0x555555);

        this.obstacles.add(wall1);
        this.obstacles.add(wall2);

        this.squadMembers = new Squad(this, this.bullets);
        this.squadMembers.spawn([
            { x: 790, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Sgt. Foley", kit: "rifler", health: 100},
            { x: 1000, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Pvt. Riley", kit: "submachinegunner", health: 100},
            { x: 860, y: 540, bodyTexture: 'bodyTexture', headTexture: 'headTexture', name: "Cpl. Miller", kit: "rifler", health: 100}
        ], kitData);

        this.enemies = new Squad(this, this.enemyBullets);
        this.enemies.spawn([
            { x: 235, y: 560, bodyTexture: 'bodyPlaceholder', headTexture: 'headPlaceholder', name: "Meanie 1", kit: "rifler", health: 100},
            { x: 300, y: 660, bodyTexture: 'bodyPlaceholder', headTexture: 'headPlaceholder', name: "Meanie 2", kit: "submachinegunner", health: 100}
        ], kitData);

        this.enemies.getAllSprites().forEach(enemy => {
            enemy.enableAI(this);
        });

        const initialSoldier = this.squadMembers.getAllSprites()
        const enemyArray = this.enemies.getAllSprites();


        enemyArray.forEach(singleVictim => {
            this.physics.add.overlap(this.bullets, singleVictim, (victim, bullet) => {
                console.log(`[DEBUG] SHOT ENEMY: ${singleVictim.nameCard.text}`);

                this.handleBulletHit(victim as any, bullet as any);
            })
        });

        initialSoldier.forEach(singleVictim => {
            this.physics.add.overlap(this.bullets, singleVictim, (victim, bullet) => {
                console.log(`[DEBUG] SHOT FRIENDLY: ${singleVictim.nameCard.text}`);
                this.handleBulletHit(victim  as any, bullet  as any);
            })
        });

        this.physics.add.collider(this.squadMembers.getAllSprites(), this.obstacles);
        this.physics.add.collider(this.enemies.getAllSprites(), this.obstacles);
        this.physics.add.collider(this.bullets, this.obstacles);

        this.scene.launch('SceneHud', { trackingTarget: initialSoldier});
    }

    update(time: number, delta: number) {
        this.squadMembers.update(time, delta);
        
        this.enemies.getAllSprites().forEach((enemy) => {
            enemy.update(time, delta, false, false, false, false);
        })

        const soldier = this.squadMembers.getAllSprites()[0];
        if (soldier) {
            this.debugLineOfSight(soldier);
        }

        const squad = this.squadMembers.getAllSprites();
        const enemySquad = this.enemies.getAllSprites();

    }

    private handleBulletHit(victimObject: Phaser.GameObjects.GameObject, bulletObject: Phaser.GameObjects.GameObject) {
        const victim = victimObject as Soldier;
        const bullet = bulletObject as Bullet;

        console.log("Victim Health:", victim.getCurrentHealth());
        console.log("Bullet Damage:", bullet.getCurrentBulletDamage());

        const bulletDamage = bullet.getCurrentBulletDamage();

        victim.takeDamage(bulletDamage);
        bullet.destroy();
        
        if (victim.getCurrentHealth() <= 0) {
            this.squadMembers.removeFromSquad(victim);
            victim.destroy();
        }
    }

    private hasLineOfSight(enemy: Soldier, player: Soldier) {
        const sightLine = new Phaser.Geom.Line(enemy.x, enemy.y, player.x, player.y);
        const walls = this.obstacles.getChildren() as Phaser.GameObjects.Rectangle[];

        for (const wall of walls) {
            const wallBounds = wall.getBounds();

            if (Phaser.Geom.Intersects.LineToRectangle(sightLine,wallBounds)) {
                return false;
            }
        }
        return true;
    }

    private debugLineOfSight(soldier: Soldier): void {
        this.debugGraphics.clear();

        this.enemies.getAllSprites().forEach((enemy) => {
            const hasLOS = this.hasLineOfSight(enemy, soldier);

            if (hasLOS) {
                this.debugGraphics.lineStyle(2, 0x00ff00, 1)
            } else {
                this.debugGraphics.lineStyle(2, 0x00ff00, 0.2)
            }

            this.debugGraphics.lineBetween(enemy.x, enemy.y, soldier.x, soldier.y);
        })
    }
}