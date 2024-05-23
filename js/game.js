/* global Phaser */

// import Scenes
import SplashScene from "./splashScene.js"
import TitleScene from "./titleScene.js"
import GameScene from "./gameScene.js"
import PauseScene from "./pauseScene.js"
import UpgradeScene from "./upgradeScene.js"
import GameOverScene from "./gameOverScene.js"
import VictoryScene from "./victoryScene.js"
import InstructionsScene from "./instructionsScene.js"

// Scenes
const splashScene = new SplashScene()
const titleScene = new TitleScene()
const gameScene = new GameScene()
const pauseScene = new PauseScene()
const upgradeScene = new UpgradeScene()
const gameOverScene = new GameOverScene()
const victoryScene = new VictoryScene()
const instructionsScene = new InstructionsScene()

// Viewport Size
const viewport_width = 800
const viewport_height = 600

// CONFIG
// ARCADE PHYSICS
// AUTO SCALING CANVAS SIZE
const config = {
    type: Phaser.AUTO,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "phaser-example",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: viewport_width,
        height: viewport_height,
    },
    backgroundColor: 0x555555,
}

// Create the game object with the config
const game = new Phaser.Game(config)

// NOTE: remember any "key" is global and CAN NOT be reused!
game.scene.add("splashScene", splashScene)
game.scene.add("titleScene", titleScene)
game.scene.add("gameScene", gameScene)
game.scene.add("pauseScene", pauseScene)
game.scene.add("upgradeScene", upgradeScene)
game.scene.add("gameOverScene", gameOverScene)
game.scene.add("victoryScene", victoryScene)
game.scene.add("instructionsScene", instructionsScene)

// Start with splashScene
game.scene.start("splashScene")
