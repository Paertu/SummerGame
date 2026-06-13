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
    };

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.actionKeys = this.scene.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            CHARSWAP: Phaser.Input.Keyboard.KeyCodes.SPACE
          }) as any;
    }

    public spawn(spawnData: any[]) {
        this.squadMembers = [];

        spawnData.forEach((data) => {
            let soldier =  new Soldier(this.scene, data.x, data.y, data.texture, data.name, data.kit, data.health);
            this.squadMembers.push(soldier);
        });
    }

    public update() {
        if (Phaser.Input.Keyboard.JustDown(this.actionKeys.CHARSWAP)) {
            if (this.squadMembers[this.activeCharacterIndex]) {
                (this.squadMembers[this.activeCharacterIndex].body as Phaser.Physics.Arcade.Body).setVelocity(0);
            }
            this.activeCharacterIndex = (this.activeCharacterIndex + 1) % this.squadMembers.length;
            console.log("[CHARACTER ACTION] Swapped to character index:", this.activeCharacterIndex);
        }
        
        let currentCharacter = this.squadMembers[this.activeCharacterIndex];
        if (!currentCharacter) return;
    
        const pointer = this.scene.input.activePointer;
        currentCharacter.rotateTowards(pointer.worldX, pointer.worldY);

        currentCharacter.healthCheck;
        console.log(currentCharacter.healthCheck);

        if (this.scene.input.activePointer.isDown) {
            currentCharacter.shoot();
        }

        let body = currentCharacter.body as Phaser.Physics.Arcade.Body;
    
        body.setVelocity(0);
    
        if (this.actionKeys.W.isDown) { body.setVelocityY(-300); }
        if (this.actionKeys.S.isDown) { body.setVelocityY(300); }
        
        if (this.actionKeys.A.isDown) { body.setVelocityX(-300); }  
        if (this.actionKeys.D.isDown) { body.setVelocityX(300); }
    }
}