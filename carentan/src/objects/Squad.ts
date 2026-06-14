import Phaser from "phaser";
import { Soldier } from "./Soldier";

export class Squad {
    private scene: Phaser.Scene;
    private squadMembers: Soldier[] =[]
    private activeCharacterIndex: number = 0;

    private actionKeys: {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
      CHARSWAP: Phaser.Input.Keyboard.Key;
      R: Phaser.Input.Keyboard.Key;
    };

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.actionKeys = this.scene.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            CHARSWAP: Phaser.Input.Keyboard.KeyCodes.SPACE,
            R: Phaser.Input.Keyboard.KeyCodes.R
          }) as any;
    }

    public spawn(spawnData: any[], kitData: any) {
        this.squadMembers = [];

        spawnData.forEach((data) => {
            const weaponStats = kitData[data.kit];

            let soldier =  new Soldier(this.scene, data.x, data.y, data.bodyTexture, data.headTexture, data.name, data.health, weaponStats);
            console.log(`[KIT DEBUG](${data.name}) | HP:${data.health} 
                \nBody Texture:${data.bodyTexture} 
                \nweapon Texture:${weaponStats.texture} 
                \naudio files:${weaponStats.weapon_sounds.shoot}, ${weaponStats.weapon_sounds.reload}
                \nfireRate(ms):${weaponStats.fireRate} 
                `)
            this.squadMembers.push(soldier);
        });
    }

    update(time: number, delta: number) {

        if (Phaser.Input.Keyboard.JustDown(this.actionKeys.CHARSWAP)) {
            if (this.squadMembers[this.activeCharacterIndex]) {
                (this.squadMembers[this.activeCharacterIndex].body as Phaser.Physics.Arcade.Body).setVelocity(0);
            }
            this.activeCharacterIndex = (this.activeCharacterIndex + 1) % this.squadMembers.length;
            console.log("[CHARACTER ACTION] Swapped to character index:", this.activeCharacterIndex);
        }
        
        let currentCharacter = this.squadMembers[this.activeCharacterIndex];
        if (!currentCharacter) return;
    
        this.squadMembers.forEach(soldier => soldier.update(time, delta));

        const pointer = this.scene.input.activePointer;
        currentCharacter.rotateTowards(pointer.worldX, pointer.worldY);

        currentCharacter.updateHealthVisuals();

        if (this.scene.input.activePointer.isDown) {
            currentCharacter.shoot();
        }

        if (Phaser.Input.Keyboard.JustDown(this.actionKeys.R)) {
            currentCharacter.reload();
        }

        let body = currentCharacter.body as Phaser.Physics.Arcade.Body;
    
        body.setVelocity(0);
    
        if (this.actionKeys.W.isDown) { body.setVelocityY(-300); }
        if (this.actionKeys.S.isDown) { body.setVelocityY(300); }
        
        if (this.actionKeys.A.isDown) { body.setVelocityX(-300); }  
        if (this.actionKeys.D.isDown) { body.setVelocityX(300); }
    }
}