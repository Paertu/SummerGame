import Phaser from "phaser";

export class Squad {
    private scene: Phaser.Scene;
    private squadMembers: Phaser.GameObjects.Container[] =[]
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

    public spawn(spawnData: Array<{x: number, y: number, texture: string, scale: number, name: string}>) {
        this.squadMembers = [];
        this.activeCharacterIndex = 0;

        spawnData.forEach((data) => {
            let unitSprite = this.scene.add.sprite(0, 0, data.texture);
            unitSprite.setScale(data.scale);
            unitSprite.setOrigin(0.5, 0.5);

            let unitNameCard = this.scene.add.text(0, unitSprite.displayHeight / 2 + 10, data.name, {
            fontSize: '16px',
            color: '#ffffff'
            }).setOrigin(0.5);

            let playerContainer = this.scene.add.container(data.x, data.y, [unitSprite, unitNameCard]);

            this.scene.physics.add.existing(playerContainer);

            console.log(`[SQUAD INITIALIZATION] Initialized squad member ${data.name}`)
            this.squadMembers.push(playerContainer);
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
    
        let body = currentCharacter.body as Phaser.Physics.Arcade.Body;
    
        body.setVelocity(0);
    
        if (this.actionKeys.W.isDown) { body.setVelocityY(-300); }
        if (this.actionKeys.S.isDown) { body.setVelocityY(300); }
        
        if (this.actionKeys.A.isDown) { body.setVelocityX(-300); }  
        if (this.actionKeys.D.isDown) { body.setVelocityX(300); }
    }
}