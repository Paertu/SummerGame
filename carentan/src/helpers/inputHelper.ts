import Phaser from "phaser";
const DEBUG_MODE = false;

export class inputHelper {
    private scene: Phaser.Scene;

    private actionKeys: {
        W: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
        CHARSWAP: Phaser.Input.Keyboard.Key;
        R: Phaser.Input.Keyboard.Key;
    };

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        
        this.actionKeys = this.scene.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            CHARSWAP: Phaser.Input.Keyboard.KeyCodes.SPACE,
            R: Phaser.Input.Keyboard.KeyCodes.R
        }) as any;
    }

    public getSquadInputs() {
        const pointer = this.scene.input.activePointer;

        const moveUpTriggered = this.actionKeys.W.isDown;
        const moveDownTriggered = this.actionKeys.S.isDown;
        const moveLeftTriggered = this.actionKeys.A.isDown;
        const moveRightTriggered = this.actionKeys.D.isDown;

        const reloadTriggered = Phaser.Input.Keyboard.JustDown(this.actionKeys.R);
        const swapTriggered = Phaser.Input.Keyboard.JustDown(this.actionKeys.CHARSWAP);

        const shootTriggered = pointer.isDown

        if (DEBUG_MODE) {
            if (reloadTriggered) {
                console.log(`[INPUT] Reload Triggered `);
            }
            if (swapTriggered) {
                console.log(`[INPUT] Swap Triggered `);
            }
            if (moveUpTriggered) {
                console.log(`[INPUT] PRESSED W `);
            }
            if (moveDownTriggered) {
                console.log(`[INPUT] PRESSED S `);
            }
            if (moveLeftTriggered) {
                console.log(`[INPUT] PRESSED A`);
            }
            if (moveRightTriggered) {
                console.log(`[INPUT] PRESSED D `);
            }           
        }
        
        return {
            isPressMoveUp: moveUpTriggered,
            isPressMoveDown: moveDownTriggered,
            isPressMoveLeft: moveLeftTriggered,
            isPressMoveRight: moveRightTriggered,

            isPressReload: reloadTriggered,
            isPressSwapped: swapTriggered,
            isShooting: shootTriggered,

            mouseX: pointer.worldX,
            mouseY: pointer.worldY,
        };
    }   
}
