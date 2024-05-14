/* global Phaser */

// TITLE SCENE
class TitleScene extends Phaser.Scene {

  // Constructor, called upon "new"
  constructor() {
    super({ key: 'titleScene' });
  }

  // Initializer, called upon "start"
  init(data) {
    // SET BACKGROUND COLOR TO BLACK
    this.cameras.main.setBackgroundColor('#000000');
  }

  // Preload, for loading assets
  preload() {
    console.log('Title Scene');
    // LOAD ASSETS FOR TITLE SCREEN

    // TITLE SCREEN VIDEO
    this.load.video("titleVideo", "././assets/titleScreen.mp4");
    // TITLE SCREEN MUSIC
    this.load.audio("titleMusic", "././sounds/titleMusic.mp3");

    // PLAY BUTTON
    this.load.image("playButton", "./assets/playButton.png");
  }

  // Create, happens after preload() is complete
  create(data) {
    
    // This line of code makes it so 
    // that sound isn't muted when game is out of input focus
    this.sound.pauseOnBlur = false;

    // DRAW VIDEO ONTO SCREEN
    this.titleVideo = this.add.video(0, 0, "titleVideo")
    // VIDEO IS CENTERED
    this.titleVideo.x = this.cameras.main.width / 2
    this.titleVideo.y = this.cameras.main.height / 2
    // RESIZE TO MAKE VIDEO FIT SCREEN
    this.titleVideo.scaleY = 1.3;

    // MAKES THE VIDEO LOOP
    // WHENEVER VIDEO ENDS, VIDEO PLAYS AGAIN
    this.titleVideo.on('complete', () => {
      this.titleVideo.play();
    });

    // INITIALIZE sound object for TITLE MUSIC
    this.titleMusic = this.sound.add("titleMusic")
    // MAKES THE MUSIC LOOP
    this.titleMusic.on("complete", () => {
      this.titleMusic.play();
    })

    //
    this.playButton = this.add.sprite(400,450,"playButton");
    this.playButton.setScale(2);
    this.playButton.setInteractive({useHandCursor : true});
    this.playButton.on( "pointerdown", () => {
      this.titleMusic.stop()
      this.scene.switch("gameScene");
    } );

    // PLAY TITLE SCREEN VIDEO AND MUSIC
    this.titleMusic.play();
    this.titleVideo.play();
  }
  
  // Delta update loop, loops whilst the scene is active
  update(time, delta) {
    // pass
  }
}

export default TitleScene