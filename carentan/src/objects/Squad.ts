import Phaser from "phaser";
import { Soldier } from "./Soldier";
import { inputHelper } from "../helpers/inputHelper";

export class Squad {
    private scene: Phaser.Scene;
    private inputHelper: inputHelper;
    private squadMembers: Soldier[] =[];
    private activeCharacterIndex: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.inputHelper = new inputHelper(this.scene);
    }

    update(time: number, delta: number) {
        const inputs = this.inputHelper.getSquadInputs();

        if (inputs.isPressSwapped) {
            if (this.squadMembers[this.activeCharacterIndex]) {
                (this.squadMembers[this.activeCharacterIndex].body as Phaser.Physics.Arcade.Body).setVelocity(0);
            }
            this.activeCharacterIndex = (this.activeCharacterIndex + 1) % this.squadMembers.length;
            console.log("[CHARACTER ACTION] Swapped to character index:", this.activeCharacterIndex);

            const newTarget = this.squadMembers[this.activeCharacterIndex];
            this.scene.events.emit('hud:swapTarget', newTarget);
        }
        
        let currentCharacter = this.squadMembers[this.activeCharacterIndex];
        if (!currentCharacter) return;
    
        this.squadMembers.forEach((soldier, index) => {
            if (index === this.activeCharacterIndex) {
                soldier.update(time, delta, inputs.isPressMoveUp, inputs.isPressMoveDown, inputs.isPressMoveLeft, inputs.isPressMoveRight, inputs.mouseX, inputs.mouseY);

                if (inputs.isShooting) {
                    soldier.shoot();
                }

                if (inputs.isPressReload) {
                    soldier.reload();
                }
            }
            else {
                soldier.update(time, delta, false, false, false, false);   
            }
        });
    }

    public spawn(spawnData: any[], kitData: any) {
        this.squadMembers = [];

        spawnData.forEach((data) => {
            const baseWeaponStats = kitData[data.kit];

            if (!baseWeaponStats) {
                console.log("[DEBUG] no base stats found");
                return;
            }

            const weaponStats = {
                texture: baseWeaponStats.texture,
                fireRate: baseWeaponStats.fireRate,
                current_ammo: baseWeaponStats.current_ammo,
                ammo: baseWeaponStats.ammo,
                weapon_sounds: baseWeaponStats.weapon_sounds,
                barrel_offset: baseWeaponStats.barrel_offset,
                damage: baseWeaponStats.damage
            };

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

    public getAllSprites(): Soldier[] {
        return this.squadMembers;
    }

    public removeFromSquad(soldierToRemove: Soldier) {
        const targetName = soldierToRemove.nameCard.text;

        const controlledCharacter = this.squadMembers[this.activeCharacterIndex];

        this.squadMembers = this.squadMembers.filter(member => { return member.nameCard.text !== targetName});

        if (controlledCharacter && controlledCharacter.nameCard.text === targetName) {
            this.activeCharacterIndex = 0;
        }   
        else {
            const newIndex = this.squadMembers.findIndex(member => member.nameCard.text === controlledCharacter.nameCard.text);
            if (newIndex !== -1) {
                this.activeCharacterIndex = newIndex;
            }

            if (this.activeCharacterIndex >= this.squadMembers.length) {
                this.activeCharacterIndex = 0;
            }
        }
    }
}