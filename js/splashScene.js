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
  }

  // Create, happens after preload() is complete
  create(data) {
    

    // DRAW VIDEO ONTO SCREEN
    this.splashVideo = this.add.video(0, 0, "splashVideo")

    // POSITION IT IN CENTER
    this.splashVideo.x = this.cameras.main.width / 2
    this.splashVideo.y = this.cameras.main.height / 2

    // RESIZE TO MAKE VIDEO FIT SCREEN
    this.splashVideo.scaleY = 1.3;

    // ONCE SPLASH SCREEN VIDEO ENDS, SWITCH TO TITLE SCENE
    this.splashVideo.on('complete', () => {
      this.scene.switch("titleScene");
    });


    // PLAY SPLASH SCREEN VIDEO
    this.splashVideo.autoplay = true;
    this.splashVideo.play(false);

    // FOR TEST/DEBUGGING
    // FAST-FORWARDS SPLASH SCREEN TO SAVE TIME
    this.splashVideo.setPlaybackRate(10)
  }

  // Delta update loop, loops whilst the scene is active
  // delta approximately = 1/fps  [ the time that has passed since the last frame (ms) ]
  // time = amount of the time the game has been running ( milliseconds )
  update(time, delta) {
    // If 15 seconds have passed, go to the title scene
    // [JUST IN CASE]
    if (time > 15000) {
      console.log("FIRE")
      this.scene.switch("titleScene")
    }
  }
}

export default SplashScene
