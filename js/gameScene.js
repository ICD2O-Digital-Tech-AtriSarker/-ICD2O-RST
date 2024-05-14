/* global Phaser */

// GAME SCENE
class GameScene extends Phaser.Scene {
  // Constructor, called upon "new"
  constructor() {
    super({ key: "gameScene" })
  }

  // INITIALIZE
  init(data) {
    
    // SET BACKGROUND COLOR TO BLACK
    this.cameras.main.setBackgroundColor("#000000")

    // CONTROL LAYOUT
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

    // HELPER FUNCTION FOR CONTROL
    this.isKeyDown = (inputKey) => {
      if (this.controls[inputKey].isDown || this.controls2[inputKey].isDown) {
        return 1
      } else {
        return 0
      }
    }

    // FUNCTION THAT RETURNS NORMALIZED DIRECTION VECTOR
    // FOR PLAYER MOVEMENT
    this.getDir = () => {
      let planeX = this.isKeyDown("RIGHT") - this.isKeyDown("LEFT")
      let planeY = this.isKeyDown("DOWN") - this.isKeyDown("UP")
      
      // PYTHAGORAS THEOREM
      let planeLength = Math.sqrt(planeX * planeX + planeY * planeY)

      // Edge case: if the length is 0, then the vector is 0
      if (planeLength === 0) {
        return { x: 0, y: 0 }
      }

      // NORMALIZED DIRECTION VECTOR
      planeX *= 1 / planeLength
      planeY *= 1 / planeLength
      
      // RETURN DIRECTION VECTOR
      return { x: planeX, y: planeY }
    }

    // PLAYER STATS
    this.plrSpeed = 15
    this.plrAttackSpeed = 500

    // GROUP FOR PLAYER PROJECTILES
    this.plrProjectiles = this.physics.add.group()
    // DEBOUNCE FOR ATTACK COOLDOWN
    this.plrProjDebounce = true

    // DEFAULT CHOSEN WEAPON
    this.plrWeapon = "rocket"
  }

  // Preload, for loading assets
  preload() {
    console.log("Game Scene")

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

    // GAME AREA, WHERE PLAYERS AND ENEMIES ARE SITUATED
    // PLAYER CANNOT EXIT GAME AREA
    this.gameArea = this.add.rectangle(400, 320, 650, 430, 0xff0000, 0.1)

    // ADD THE PLAYER SPRITE TO THE GAME
    this.player = this.physics.add.sprite(400, 300, "player").setScale(0.8)

    // CONNECT LMB TO SWITCHING PLAYER WEAPON
    this.input.on(
      "pointerdown",
      function (pointer) {
        this.switchWeapon()
      },
      this
    )

    // CROSSHAIR STYLE FOR CURSOR
    this.sys.canvas.style.cursor = "crosshair"
  }

  // Delta update loop, loops whilst the scene is active
  update(time, delta) {

    // GET DIRECTION VECTOR
    let dir = this.getDir()
    // MOVE PLAYER FORWARD WITH DIRECTION VECTOR
    this.player.x += dir.x * this.plrSpeed * 0.01 * delta
    this.player.y += dir.y * this.plrSpeed * 0.01 * delta

    // PREVENT PLAYER FROM EXITING GAME AREA
    // CLAMPS PLAYER POSITION TO ONLY BE WITHIN GAME AREA
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

    // CODE FOR SHOOTING PROJECTILE
    // USES DEBOUNCE TO PREVENT PLAYER FROM SHOOTING TOO MUCH
    if (this.plrProjDebounce) {
      // TURN ON DEBOUNCE
      this.plrProjDebounce = false
      // Create projectile at player
      let newProjectile = this.add.sprite(
        this.player.x,
        this.player.y,
        this.plrWeapon
      )

      // MAKE PROJECTILE THE CHOSEN WEAPON TYPE
      newProjectile.weaponType = this.plrWeapon
      
      // Make projectile face mouse
      // 1.57 is precalculated estimate of Math.PI / 2,
      // which is 180 degrees
      // which is added due to the orientation of the image
      let cursor = this.input.activePointer
      newProjectile.rotation =
        Phaser.Math.Angle.Between(
          newProjectile.x,
          newProjectile.y,
          cursor.worldX,
          cursor.worldY
        ) + 1.57

      // PROJECTILE IS INSTANTLY PUSHED A BIT
      // FOR BETTER EFFECT, ( NOT ON TOP OF PLAYER )
      newProjectile.x += Math.sin(newProjectile.rotation) * 27
      newProjectile.y -= Math.cos(newProjectile.rotation) * 27
      if (newProjectile.weaponType  === "axe") {
        newProjectile.setScale(0.5)
      }

      // ADD PROJECTILE TO POOL/GROUP
      this.plrProjectiles.add(newProjectile)

      // TURN OFF DEBOUNCE AFTER 500ms
      // FOR NEXT SHOT
      setTimeout(() => {
        this.plrProjDebounce = true
      }, this.plrAttackSpeed)
    }

    // Make each rocket go forward
    this.plrProjectiles.children.each((proj) => {
      if (proj.weaponType === "rocket") {
        let rocket = proj
        rocket.x += Math.sin(rocket.rotation) * 0.3 * delta
        rocket.y -= Math.cos(rocket.rotation) * 0.3 * delta

        // if rocket leaves gameArea, delete it
        if (
          rocket.x < this.gameArea.x - this.gameArea.width / 1.6 ||
          rocket.x > this.gameArea.x + this.gameArea.width / 1.6 ||
          rocket.y < this.gameArea.y - this.gameArea.height / 1.6 ||
          rocket.y > this.gameArea.y + this.gameArea.height / 1.6
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
