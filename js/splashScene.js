// SPLASH SCENE
class SplashScene extends Phaser.Scene {
  // Constructor, called upon "new"
  constructor() {
    super({ key: "splashScene" })
  }

  // Initializer, called upon "start"
  init(data) {
    this.cameras.main.setBackgroundColor("#123466")
  }

  // Preload, for loading assets
  preload() {
    console.log("Splash Scene")
    this.load.video("video", "./../assets/splashVideo.mp4")
  }

  // Create, happens after preload() is complete
  create(data) {
    this.video = this.add.video(0, 0, "video")
    this.video.x = this.cameras.main.width / 2
    this.video.y = this.cameras.main.height / 2
    this.video.scaleY = 1.3;

    this.video.on('complete', () => {
      this.scene.switch("titleScene");
    });

    this.video.play();
  }

  // Delta update loop, loops whilst the sceen is active
  // delta approximately = 1/fps  [ the time that has passed since the last frame (ms) ]
  // time = amount of the time the scene has been running ( milliseconds )
  update(time, delta) {
    // If 3 seconds have passed, go to the title scene
    // if (time > 10000) {
    //   console.log("FIRE")
    //   this.scene.start("titleScene")
    // }
  }
}

export default SplashScene
