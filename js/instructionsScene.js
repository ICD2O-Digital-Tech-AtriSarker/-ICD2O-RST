// For button
import UIhandler from "./UIhandler.js"

// Instructions Scene

class InstructionsScene extends Phaser.Scene {
  constructor() {
    super({ key: "instructionsScene" })
  }

  init(data) {
    this.cameras.main.setBackgroundColor("#557766")
    this.UI = new UIhandler(this)
  }

  preload() {
    console.log("Instruction Scene")
  }

  create(data) {
    //INSTRUCTIONS
    this.add.text(
      100,
      100,
      `INSTRUCTIONS:\n 
      Move with WASD/Arrow Keys\n
      Shooting is aimed with mouse\n
      Shots are done automatically\n
      Mouse click to change weapon\n

      Avoid Getting by red enemy projectiles\n
      Enemy health is connected to Enemy Transparency\n
      Kill enemies to gain xp to level up\n
      Gain an upgrade when leveling up\n

      Survive 15 Waves\n
      Good Luck!

      `,
      { fontSize: "18px", fill: "#fff" }
    )

    // BACK BUTTON
    this.UI.createButton(
      400,
      500,
      "BACK TO TITLE SCREEN",
      function () {
        this.scene.switch("titleScene")
      }.bind(this)
    )

  }

  update(time, delta) {
    // pass
  }
}

export default InstructionsScene
