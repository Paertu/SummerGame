export class MovementComponent {
    private target: Phaser.GameObjects.Container;
    private body: Phaser.Physics.Arcade.Body;
    private speed: number;

    constructor(target: Phaser.GameObjects.Container, speed: number = 300) {
        this.target = target;
        this.speed = speed;

        if (!target.body) {
            target.scene.physics.world.enable(target);
        }
        this.body = target.body as Phaser.Physics.Arcade.Body
    }
    
    public update(up: boolean, down: boolean, left: boolean, right: boolean) {
        this.body.setVelocity(0);

        let velocityX = 0;
        let velocityY = 0;

        if (up) velocityY = -this.speed;
        if (down) velocityY = this.speed;
        if (left) velocityX = -this.speed;
        if (right) velocityX = this.speed;

        this.body.setVelocity(velocityX, velocityY);
    }
}