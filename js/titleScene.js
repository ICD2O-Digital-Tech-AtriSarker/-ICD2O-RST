/* global Phaser */

// TITLE SCENE
class TitleScene extends Phaser.Scene {

  // Constructor, called upon "new"
  constructor() {
    super({ key: 'titleScene' });
  }

  // Initializer, called upon "start"
  init(data) {
    this.cameras.main.setBackgroundColor('#000000');
  }

  // Preload, for loading assets
  preload() {
    console.log('Title Scene');
    // LOAD IMAGES HERE
    this.load.video("video2", "./../assets/titleScreen.mp4")
    this.load.audio("titleMusic", "./../assets/titleMusic.mp3");
  }

  // Create, happens after preload() is complete
  create(data) {
    this.sound.pauseOnBlur = false;
    this.video2 = this.add.video(0, 0, "video2")
    this.video2.x = this.cameras.main.width / 2
    this.video2.y = this.cameras.main.height / 2
    this.video2.scaleY = 1.3;

    this.video2.on('complete', () => {
      this.video2.play();
    });

    this.titleMusic = this.sound.add("titleMusic")
    this.titleMusic.on("complete", () => {
      this.titleMusic.play();
    })
    this.titleMusic.play();
    this.video2.play();
  }
  
  // Delta update loop, loops whilst the sceen is active
  update(time, delta) {
    // pass
  }
}

export default TitleScene