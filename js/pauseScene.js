// SPLASH SCENE
class PauseScene extends Phaser.Scene {
  // Constructor, called upon "new"
  constructor() {
    super({ key: "pauseScene" })
  }

  // Initializer, called upon "start"
  init(data) {

  }

  // Preload, for loading assets
  preload() {

  }

  // Create, happens after preload() is complete
  create(data) {
    this.pauseScreen = this.add.image(400, 300, "pauseScreen")
    this.pauseScreen.setScale(1)
    this.pauseScreen.setAlpha(0.7)
    this.pauseScreen.setInteractive({ useHandCursor: true })
    this.pauseScreen.on("pointerdown", function () {
      this.scene.resume('gameScene');
      this.scene.stop();
    }.bind(this))
  }

  // Delta update loop, loops whilst the scene is active
  // delta approximately = 1/fps  [ the time that has passed since the last frame (ms) ]
  // time = amount of the time the game has been running ( milliseconds )
  update(time, delta) {
    
  }
}

export default PauseScene
