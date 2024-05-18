/* global Phaser */

class enemyHandler {
  constructor(gameScene) {
    this.gameScene = gameScene

    //
    // GROUP FOR PLAYER PROJECTILES
    this.Enemies = this.gameScene.physics.add.group()
    this.EnemyProjectiles = this.gameScene.physics.add.group()
    this.EnemyList = []

    this.spawners = this.gameScene.add.group()

    this.createEnemies()
    this.createWaves()

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
      this.gameScene.load.image(name, `./assets/projectiles/${name}.png`)
    }

    // ENEMY SPRITES
    loadEnemy("goose")
    loadEnemy("amazingBulk")
    loadEnemy("warrior")

    // PROJECTILE SPRITES
    loadProjectile("rocket")
    loadProjectile("bulkFist")
    loadProjectile("mace")
  }

  spawnEnemy(enemyDataName, posX, posY) {
    let enemyData = this.EnemyList[enemyDataName]

    let enemy = this.gameScene.physics.add.sprite(
      posX,
      posY,
      enemyData.spriteKey
    )

    enemy.setScale(enemyData.spriteSize / enemy.width)

    enemy.stats = {}
    Object.assign(enemy.stats, enemyData)
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
      enemyData.nextAction += delta
      if (enemyData.nextAction > enemyData.actionSpeed) {
        enemyData.nextAction = 0
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

        console.log(projectile.type)
        console.log(projectile)
        if (projectile.weaponType == "rocket") {
          enemy.health -= 22
        } else {
          enemy.health -= 45
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

  createEnemies() {
    let enm = null
    // GOOSE
    this.EnemyList["goose"] = this.newEnemy()
    enm = this.EnemyList["goose"]
    enm.maxHealth = 100
    enm.moveAmount = 100
    enm.damage = 10
    enm.projectileKey = "rocket"
    enm.projectileSize = 40
    enm.projectileSpeed = 90
    enm.projectileDistance = 2000
    enm.spriteKey = "goose"
    enm.spriteSize = 70
    enm.actionLoop = ["advance", "shoot", "retreat", "retreat"]
    enm.actionLoopIndex = 0
    enm.actionSpeed = 400
    enm.nextAction = 0

    // BULK
    this.EnemyList["bulk"] = this.newEnemy()
    enm = this.EnemyList["bulk"]
    enm.maxHealth = 200
    enm.moveAmount = 60
    enm.damage = 30
    enm.projectileKey = "bulkFist"
    enm.projectileSize = 80
    enm.projectileSpeed = 200
    enm.projectileDistance = 100
    enm.spriteKey = "amazingBulk"
    enm.spriteSize = 110
    enm.actionLoop = ["advance", "shoot", "advance", "advance", "shoot"]
    enm.actionSpeed = 370

    // WARRIOR
    this.EnemyList["warrior"] = this.newEnemy()
    enm = this.EnemyList["warrior"]
    enm.maxHealth = 120
    enm.moveAmount = 90
    enm.damage = 20
    enm.projectileKey = "mace"
    enm.projectileSize = 50
    enm.projectileSpeed = 50
    enm.projectileDistance = 80
    enm.spriteKey = "warrior"
    enm.spriteSize = 70
    enm.actionLoop = ["advance", "shoot", "advance"]
    enm.actionSpeed = 400

    enm = null
  }

  createWaves() {
    this.waves = []

    // WAVE 1
    this.waves.push(["goose"])
    // WAVE 2
    this.waves.push(["goose", "warrior", "goose"])
    // WAVE 3
    this.waves.push(["bulk", "goose", "goose"])
    // WAVE 4
    this.waves.push(["goose", "goose", "goose", "goose", "goose", "goose"])

    this.currentWaveNumber = 0
  }

  spawnWave() {
    let newWave = this.waves[this.currentWaveNumber]
    if (newWave === undefined) {
      return
    }

    this.waveSpawning = true

    this.waveText.setText(
      `Wave: ${this.currentWaveNumber + 1}/${this.waves.length}`
    )
    for (let i = 0; i < newWave.length; i++) {
      let enemyName = newWave[i]
      let enemySize = this.EnemyList[enemyName].spriteSize

      let posX = this.randInt(
        this.gameScene.gameArea.x -
          (this.gameScene.gameArea.width - enemySize) / 2,
        this.gameScene.gameArea.x +
          (this.gameScene.gameArea.width - enemySize) / 2
      )
      let posY = this.randInt(
        this.gameScene.gameArea.y -
          (this.gameScene.gameArea.height - enemySize) / 2,
        this.gameScene.gameArea.y +
          (this.gameScene.gameArea.height - enemySize) / 2
      )

      let spawner = this.gameScene.add.image(
        posX,
        posY,
        this.EnemyList[enemyName].spriteKey
      )

      spawner.tint = 0x000000
      spawner.alpha = 0.1
      spawner.setScale(this.EnemyList[enemyName].spriteSize / spawner.width)
      
      spawner.enemyName = enemyName

      this.spawners.add(spawner)
    }
    
    let spawnTween = this.gameScene.tweens.create({
      targets: this.spawners.getChildren(),
      tint: 0xffffff,
      alpha: 1,
      ease: "Power1",
      duration: 2000,
    })

    // ON TWEEN COMPLETE, SPAWN ALL ENEMIES
    spawnTween.on("complete", () => {
      this.spawners.children.each(function (spawner) {
        let enemyName = spawner.enemyName
        let enemy = this.spawnEnemy(enemyName, spawner.x, spawner.y)
        spawner.destroy()
      }.bind(this))
      this.waveSpawning = false
    })

    this.gameScene.add.tween(spawnTween)

    
    this.currentWaveNumber += 1
  }

  handleWaves() {
    if (this.waveSpawning) {
      return
    }
    // Get current enemy amount
    let enemyAmount = this.Enemies.children.size
    // Check if we need to start a new wave
    if (enemyAmount == 0) {
      this.spawnWave()
    }
  }

  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

// export
export default enemyHandler
