/* global Phaser */

class enemyHandler {
  constructor(gameScene) {
    this.gameScene = gameScene

    //
    // GROUP FOR PLAYER PROJECTILES
    this.Enemies = this.gameScene.physics.add.group()
    this.EnemyProjectiles = this.gameScene.physics.add.group()
    this.EnemyList = []

    this.EnemyList["goose"] = this.newEnemy()
    console.log(this.EnemyList)
  }

  newEnemy = () => {
    let enemy = {}
    enemy.maxHealth = 100
    enemy.moveAmount = 100
    enemy.damage = 10
    enemy.projectileKey = "rocket"
    enemy.projectileSize = 40
    enemy.projectileSpeed = 90
    enemy.projectileDistance = 2000
    enemy.spriteKey = "goose"
    enemy.spriteSize = 70

    // advance : goes towards player
    // retreat : goes away from player
    // shoot : fire projectile
    // idle : do nothing
    enemy.actionLoop = ["advance", "shoot", "advance"]
    enemy.actionLoopIndex = 0
    enemy.actionSpeed = 400
    enemy.nextAction = 0

    return enemy
  }

  loadAssets() {
    let loadEnemy = (name) => {
      this.gameScene.load.image(name, `./assets/enemySprites/${name}.png`)
    }
    let loadProjectile = (name) => {
      this.gameScene.load.image(name, `./assets/${name}.png`)
    }

    loadEnemy("goose")
    loadProjectile("rocket")
  }

  spawnEnemy(enemyDataName, posX, posY) {
    let enemyData = this.EnemyList[enemyDataName]

    let enemy = this.gameScene.physics.add.sprite(
      posX,
      posY,
      enemyData.spriteKey
    )

    enemy.setScale(enemyData.spriteSize / enemy.width)

    enemy.stats = enemyData
    enemy.health = enemyData.maxHealth
    enemy.hitList = {}

    // Add enemy to pool
    this.Enemies.add(enemy)

    return enemy
  }

  handleAction(time, delta) {
    let player = this.gameScene.player
    this.Enemies.children.each((enemy) => {
      let enemyData = enemy.stats
      if (enemyData.nextAction < time) {
        enemyData.nextAction = time + enemyData.actionSpeed
      } else {
        // do nothing
        return
      }

      let action = enemyData.actionLoop[enemyData.actionLoopIndex]

      switch (action) {
        case "advance": {
          let direction =
            Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y) +
            Math.random() * 0.2 -
            0.1

          enemy.setVelocityX(Math.cos(direction) * enemyData.moveAmount)
          enemy.setVelocityY(Math.sin(direction) * enemyData.moveAmount)
          break
        }

        case "retreat": {
          let direction =
            Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y) +
            Math.random() * 0.2 -
            0.1

          enemy.setVelocityX(-Math.cos(direction) * enemyData.moveAmount)
          enemy.setVelocityY(-Math.sin(direction) * enemyData.moveAmount)
          break
        }
        case "shoot": {
          enemy.body.setVelocity(0, 0)

          // CREATE PROJECTILE
          let projectile = this.gameScene.physics.add.sprite(
            enemy.x,
            enemy.y,
            `${enemyData.projectileKey}`
          )

          let newWidth = enemyData.projectileSize
          let newHeight = newWidth * (enemy.height / enemy.width)

          projectile.scaleX = newWidth / enemy.width
          projectile.scaleY = newHeight / enemy.height

          projectile.body.setSize(newWidth * 0.7, newHeight * 0.7)

          // Make it go towards player
          let direction = Phaser.Math.Angle.Between(
            enemy.x,
            enemy.y,
            player.x,
            player.y
          )

          projectile.rotation = direction + 1.57
          projectile.setTint(0xff0000)

          this.EnemyProjectiles.add(projectile)
          projectile.setVelocityX(
            Math.cos(direction) * enemyData.projectileSpeed
          )
          projectile.setVelocityY(
            Math.sin(direction) * enemyData.projectileSpeed
          )

          // delete after certain amount of time
          this.gameScene.time.addEvent({
            delay:
              (1000 * enemyData.projectileDistance) / enemyData.projectileSpeed,
            callback: () => {
              projectile.destroy()
            },
          })

          // ADD TO GROUP
          projectile.damage = enemyData.damage

          break
        }
        case "idle": {
          enemy.body.setVelocity(0, 0)
          break
        }
      }

      enemy.flipX = player.x > enemy.x

      // advance to next action
      enemyData.actionLoopIndex =
        (enemyData.actionLoopIndex + 1) % enemyData.actionLoop.length
    })
  }

  addColliders() {
    this.gameScene.physics.add.collider(
      this.gameScene.player,
      this.EnemyProjectiles,
      (player, projectile) => {
        this.gameScene.plrHealth -= projectile.damage
        projectile.destroy()
      }
    )
    this.gameScene.physics.add.collider(
      this.Enemies,
      this.gameScene.plrProjectiles,
      (enemy, projectile) => {
        if (enemy.hitList[projectile.id]) {
          return
        }
        enemy.hitList[projectile.id] = true

        if (projectile.type == "rocket") {
          enemy.health -= 15
        } else {
          enemy.health -= 30
        }

        enemy.setAlpha(0.1 + enemy.health / enemy.stats.maxHealth)

        if (enemy.health <= 0) {
          enemy.destroy()
          return
        }
      }
    )
  }

  addText() {
    this.waveText = this.gameScene.add.text(10, 10, "Wave: 1/10", {
      fontFamily: "Oswald",
      fontSize: "26px",
      color: "#fff",
      fontStyle: "normal",
    })
  }
}

// export
export default enemyHandler
