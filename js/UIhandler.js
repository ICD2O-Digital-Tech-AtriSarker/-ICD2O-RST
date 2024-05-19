/* global Phaser */

class UIHandler {
  constructor(scene) {
    this.scene = scene
  }

  createButton(posX, posY, text, callback) {
    let button = this.scene.add.text(posX, posY, text, {
      fontFamily: "Oswald",
      fontSize: "26px",
      color: "#fff",
      backgroundColor: "#000000",
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

    button.setInteractive({ useHandCursor: true })
    button.on("pointerover", () => {
      button.setTint(0x00ff00)
    })
    button.on("pointerout", () => {
      button.setTint(0xffffff)
    })
    button.on("pointerdown", callback)
    return button
  }

  createBar(posX, posY, width, height, name) {
    let back = this.scene.add.rectangle(posX, posY, width, height, 0x222222)
    back.setOrigin(0, 0)
    back.setStrokeStyle(4, 0x000000, 1)
    
    let bar = this.scene.add.rectangle(posX, posY, width, height, 0xffffff)
    bar.setOrigin(0, 0)
    bar.isStroked = true
    bar.setStrokeStyle(4, 0x000000, 1)

    bar.back = back

    // ADD TEXT TO BAR
    bar.text = this.scene.add.text(posX, posY, name, {
      fontFamily: "Oswald",
      fontSize: "16px",
      color: "#ffffff",
      fontStyle: "normal",
      padding: { left: 16, right: 16, top: 4, bottom: 4 },
    })
    
    bar.text.setOrigin(0, 0)

    bar.update = (maxValue, currentValue) => {
      // UPDATE BAR PROGRESS, CLAMPED TO VALID PORPORTION
      bar.scaleX = Math.min(Math.max(currentValue / maxValue, 0), 1)
      bar.text.setText(`[${name}] ${currentValue}/${maxValue}`)
    }

    return bar
  }
}

export default UIHandler
