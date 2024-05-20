// GAME OVER SCENE
class GameOverScene extends Phaser.Scene {
  // Constructor, called upon "new"
  constructor() {
    super({ key: "gameOverScene" })
  }

  // Initializer, called upon "start"
  init(data) {
    if (data.stop) {
      console.log("STOP")
      this.scene.stop()
    }
  }

  // Preload, for loading assets
  preload() {

  }

  // Create, happens after preload() is complete
  create(data) {
    console.log("GAME OVER")
    // Game Over Text
    this.gameOverText = this.add.text(400, 260, "GAME OVER", {
      fontFamily: "Oswald",
      fontSize: "64px",
      color: "#ffffff",
      fontStyle: "normal",
      strokeThickness: 3,
      shadow: {
        color: "#000000",
        fill: true,
        offsetX: 2,
        offsetY: 2,
        blur: 3,
        stroke: true,
      },
      padding: { left: 16, right: 16, top: 4, bottom: 4 },
      maxLines: 1,
    })
    this.gameOverText.setOrigin(0.5,0.5)
    
    this.tryAgainButton = this.add.image(400, 380, "tryAgainButton")
    
    this.tryAgainButton.setInteractive({ useHandCursor: true })
    this.tryAgainButton.on("pointerdown", function () {
      this.scene.resume('gameScene');
      this.scene.stop();
    }.bind(this))

    this.scene.bringToTop()
  }

  // Delta update loop, loops whilst the scene is active
  // delta approximately = 1/fps  [ the time that has passed since the last frame (ms) ]
  // time = amount of the time the game has been running ( milliseconds )
  update(time, delta) {

  }
}

export default GameOverScene
