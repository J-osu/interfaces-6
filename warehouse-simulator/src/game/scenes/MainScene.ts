// @ts-nocheck
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainScene extends Scene {
    player!: Phaser.Physics.Arcade.Sprite;
    box!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    speed: number = 200;

    constructor() {
        super('MainScene');
    }

    preload() {
        const graphics = this.add.graphics();
        
        // Forklift (Player) texture
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('forklift', 32, 32);
        graphics.clear();

        // Box texture
        graphics.fillStyle(0xaa6600, 1);
        graphics.fillRect(0, 0, 24, 24);
        graphics.generateTexture('box', 24, 24);
        graphics.clear();
    }

    create() {
        // Create player
        this.player = this.physics.add.sprite(100, 100, 'forklift');
        this.player.setCollideWorldBounds(true);

        // Create initial box
        this.spawnBox();

        // Setup input
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        // Emit ready event
        EventBus.emit('current-scene-ready', this);
    }

    spawnBox() {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = Phaser.Math.Between(50, this.scale.height - 50);
        
        if (this.box) {
            this.box.setPosition(x, y);
            this.box.enableBody(true, x, y, true, true);
        } else {
            this.box = this.physics.add.sprite(x, y, 'box');
        }

        // Add overlap detection
        // @ts-ignore
        this.physics.add.overlap(this.player, this.box, this.collectBox, undefined, this);
    }

    collectBox(player: any, box: any) {
        const boxSprite = box as Phaser.Physics.Arcade.Sprite;
        boxSprite.disableBody(true, true);
        
        // Emit custom event for Vue
        EventBus.emit('box-collected');

        // Respawn box after a short delay
        this.time.delayedCall(500, this.spawnBox, [], this);
    }

    update() {
        if (!this.cursors) return;

        // Reset velocity
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.speed);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-this.speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.speed);
        }
    }
}
