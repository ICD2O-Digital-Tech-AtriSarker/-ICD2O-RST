/* global Phaser */

// TITLE SCENE
class GameScene extends Phaser.Scene {
  // Constructor, called upon "new"
  constructor() {
    super({ key: "gameScene" })
  }

  // Initializer, called upon "start"
  init(data) {
    // SET BACKGROUND COLOR TO GREEN
    this.cameras.main.setBackgroundColor("#000000")

    // Create control functions
    this.controls = {}
    this.controls["LEFT"] = this.input.keyboard.addKey("LEFT")
    this.controls["RIGHT"] = this.input.keyboard.addKey("RIGHT")
    this.controls["UP"] = this.input.keyboard.addKey("UP")
    this.controls["DOWN"] = this.input.keyboard.addKey("DOWN")

    this.controls2 = {}
    this.controls2["LEFT"] = this.input.keyboard.addKey("A")
    this.controls2["RIGHT"] = this.input.keyboard.addKey("D")
    this.controls2["UP"] = this.input.keyboard.addKey("W")
    this.controls2["DOWN"] = this.input.keyboard.addKey("S")

    this.isKeyDown = (inputKey) => {
      if (this.controls[inputKey].isDown || this.controls2[inputKey].isDown) {
        return 1
      } else {
        return 0
      }
    }

    this.getDir = () => {
      let planeX = this.isKeyDown("RIGHT") - this.isKeyDown("LEFT")
      let planeY = this.isKeyDown("DOWN") - this.isKeyDown("UP")
      // NORMALIZE THE VECTOR
      let planeLength = Math.sqrt(planeX * planeX + planeY * planeY)
      if (planeLength === 0) {
        return { x: 0, y: 0 }
      }
      planeX *= 1 / planeLength
      planeY *= 1 / planeLength
      // RETURN MOVEMENT VECTOR
      return { x: planeX, y: planeY }
    }

    // SPEED
    this.speed = 3

    // GROUP FOR PLAYER PROJECTILES
    this.plrProjectiles = this.physics.add.group()
    this.plrProjDebounce = true

    this.plrWeapon = "rocket"
  }

  // Preload, for loading assets
  preload() {
    console.log("Game Scene")
    // LOAD ASSETS FOR TITLE SCREEN

    // ARENA
    this.load.image("arena", "./assets/arena.jpg")
    // PLAYER
    this.load.image("player", "./assets/player.png")
    // ROCKET
    this.load.image("rocket", "./assets/rocket.png")
    // AXE
    this.load.image("axe", "./assets/axe.png")
  }

  // Create, happens after preload() is complete
  create(data) {
    // this.add.sprite(0, 0, "arena").setScale(9);
    this.gameArea = this.add.rectangle(400, 320, 650, 430, 0xff0000, 0.1)
    this.player = this.physics.add.sprite(400, 300, "player").setScale(0.8)

    this.input.on(
      "pointerdown",
      function (pointer) {
        this.switchWeapon()
      },
      this
    )
    this.sys.canvas.style.cursor = "crosshair"
  }

  // Delta update loop, loops whilst the scene is active
  update(time, delta) {
    let dir = this.getDir()
    this.player.x += dir.x * this.speed * 0.1 * delta
    this.player.y += dir.y * this.speed * 0.1 * delta

    // CLAMP player within game area
    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      this.gameArea.x - this.gameArea.width / 2,
      this.gameArea.x + this.gameArea.width / 2
    )

    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      this.gameArea.y - this.gameArea.height / 2,
      this.gameArea.y + this.gameArea.height / 2
    )

    if (this.plrProjDebounce) {
      this.plrProjDebounce = false
      // Create projectile at player
      let newProjectile = this.add.sprite(
        this.player.x,
        this.player.y,
        this.plrWeapon
      )
      newProjectile.weaponType = this.plrWeapon
      // Make projectile face mouse
      let cursor = this.input.activePointer
      newProjectile.rotation =
        Phaser.Math.Angle.Between(
          newProjectile.x,
          newProjectile.y,
          cursor.worldX,
          cursor.worldY
        ) + 1.57

      this.plrProjectiles.add(newProjectile)

      setTimeout(() => {
        this.plrProjDebounce = true
      }, 500)
    }

    // Make each rocket go forward
    this.plrProjectiles.children.each((proj) => {
      if (proj.weaponType === "rocket") {
        let rocket = proj
        rocket.x += Math.sin(rocket.rotation) * 0.3 * delta
        rocket.y -= Math.cos(rocket.rotation) * 0.3  * delta

        // if rocket leaves gameArea, delete it
        if (
          rocket.x < this.gameArea.x - this.gameArea.width / 1.8 ||
          rocket.x > this.gameArea.x + this.gameArea.width / 1.8 ||
          rocket.y < this.gameArea.y - this.gameArea.height / 1.8 ||
          rocket.y > this.gameArea.y + this.gameArea.height / 1.8
        ) {
          // Delete rocket
          rocket.destroy()
        }
      } else if (proj.weaponType === "axe") {
        let axe = proj
        axe.x += Math.sin(axe.rotation) * 0.04 * delta
        axe.y -= Math.cos(axe.rotation) * 0.04 * delta
        console.log(axe.lifespan)
        if (axe.lifespan > 0) {
          console.log("2")
          if (time > axe.lifespan) {
            axe.destroy()
          }
        } else {
          axe.lifespan = time + 700
          console.log("e")
        }
      }
    })
  }

  switchWeapon() {
    // TODO: switch weapon to axe
    if (this.plrWeapon == "rocket") {
      this.plrWeapon = "axe"
    } else {
      this.plrWeapon = "rocket"
    }
  }
}

export default GameScene
