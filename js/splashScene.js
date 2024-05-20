// SPLASH SCENE
class SplashScene extends Phaser.Scene {
  // Constructor, called upon "new"
  constructor() {
    super({ key: "splashScene" })
  }

  // Initializer, called upon "start"
  init(data) {
    // SET BACKGROUND COLOR TO BLUISH COLOR
    this.cameras.main.setBackgroundColor("#123466")
  }

  // Preload, for loading assets
  preload() {
    console.log("Splash Scene")
    // LOAD SPLASH SCREEN VIDEO
    this.load.video("splashVideo", "./assets/splashVideo.mp4")

    // Load Start Screen
    this.load.image("startScreen",  "./assets/startScreen.png")

    // Load Pause Screen
    this.load.image("pauseScreen",  "./assets/pauseScreen.png")

    // Load Upgrade Screen/Menu
    this.load.image("upgradeScreen",  "./assets/upgradeScreen.png")

    // Load Try Again Button
    this.load.image("tryAgainButton",  "./assets/tryAgainButton.png")
  }

  // Create, happens after preload() is complete
  create(data) {

    this.startedTime = -999999999
    this.startScreen = this.add.image(400, 300, "startScreen")
    this.startScreen.setInteractive({ useHandCursor: true })
    this.startScreen.on("pointerdown", function () {
      this.startScreen.x = 1600
      // PLAY SPLASH SCREEN VIDEO
      // DRAW VIDEO ONTO SCREEN
      this.splashVideo = this.add.video(0, 0, "splashVideo")

      // POSITION IT IN CENTER
      this.splashVideo.x = this.cameras.main.width / 2
      this.splashVideo.y = this.cameras.main.height / 2

      // RESIZE TO MAKE VIDEO FIT SCREEN
      this.splashVideo.scaleY = 1.3

      // ONCE SPLASH SCREEN VIDEO ENDS, SWITCH TO TITLE SCENE
      this.splashVideo.on("complete", () => {
        this.scene.switch("titleScene")
      })
      this.splashVideo.play(false)
      this.startedTime = 0


      // FOR TEST/DEBUGGING
      // FAST-FORWARDS SPLASH SCREEN TO SAVE TIME
      this.splashVideo.setPlaybackRate(10)
    }.bind(this))

  }

  // Delta update loop, loops whilst the scene is active
  // delta approximately = 1/fps  [ the time that has passed since the last frame (ms) ]
  // time = amount of the time the game has been running ( milliseconds )
  update(time, delta) {
    // [JUST IN CASE, if video does not play]
    
    if ( this.startedTime > 10000 ) {
      this.scene.switch("titleScene")
    } else {
      this.startedTime += delta
    }
  }
}

export default SplashScene
