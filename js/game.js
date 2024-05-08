/* global Phaser */

// import Scenes
import SplashScene from './splashScene.js'
// import TitleScene from './js/titleScene.js';
// import GameScene from './js/gameScene.js'

// Our game scenes
const splashScene = new SplashScene()

// Viewport Size
const viewport_width = 800;
const viewport_height = 600;

// CONFIG
// ARCADE PHYSICS
// AUTO SCALING CANVAS SIZE
const config = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: viewport_width,
        height: viewport_height
    },
    backgroundColor: 0x555555
}

const game = new Phaser.Game(config)
// NOTE: remember any "key" is global and CAN NOT be reused!
game.scene.add('splashScene', splashScene)

// start title
game.scene.start('splashScene')

