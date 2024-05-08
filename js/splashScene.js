class SplashScene extends Phaser.Scene {

  // Constructor, called upon "new"
  constructor() {
    super({ key: 'splashScene' })
    this.splashSceneBackgroundImage = null
  }

  // Initializer, called upon "start"
  init(data) {
    this.cameras.main.setBackgroundColor('#123466')
  }

  // Preload, for loading assets
  preload() {
    console.log('Splash Scene')
    this.load.image('splashSceneBackground', './../assets/splashSceneImage.png')
  }

  // Create, data is passed parameters
  create(data) { 
    this.splashSceneBackgroundImage = this.add.sprite(0, 0, 'splashSceneBackground')
    this.splashSceneBackgroundImage.x = this.game.config.width / 2;
    this.splashSceneBackgroundImage.y = this.game.config.height / 2;
  }

  // Delta update loop, loops whilst the 
  update(time, delta) {
    if (this.splashSceneBackgroundImage) {
      this.splashSceneBackgroundImage.x += 2
    }
  }
}

export default SplashScene