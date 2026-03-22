import { AUTO, Game } from 'phaser';
import { MainScene } from './scenes/MainScene';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
export const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2e3238', // Dark industrial background
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        MainScene
    ]
};

export const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};
