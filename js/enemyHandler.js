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

    // Amount of xp to be awarded upon kill
    enemy.xp = 40

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
    loadEnemy("megaKnight")
    loadEnemy("gatlingPea")
    loadEnemy("triplePea")

    // PROJECTILE SPRITES
    loadProjectile("rocket")
    loadProjectile("bulkFist")
    loadProjectile("mace")
    loadProjectile("megaFist")
    loadProjectile("pea")
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
    this.handleWaves()
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
          // Make it go towards player
          let direction = Phaser.Math.Angle.Between(
            enemy.x,
            enemy.y,
            player.x,
            player.y
          )
          this.shootInDirection(enemy, direction)
          break
        }
        case "moveVertical": {
          // Random Number : 1 or -1
          let direction = Math.random() > 0.5 ? 1 : -1
          enemy.setVelocityY( direction * enemyData.moveAmount)
          break
        }
        case "tripleShot": {
          let direction = Phaser.Math.Angle.Between(
            enemy.x,
            enemy.y,
            player.x,
            player.y
          )
          this.shootInDirection(enemy, direction)
          this.shootInDirection(enemy, direction + 0.3)
          this.shootInDirection(enemy, direction - 0.3)
          break
        }
        case "axisShot": {
          // Shoot a projectiles in all axis directions
          this.shootInDirection(enemy, 0)
          this.shootInDirection(enemy, 1.57)
          this.shootInDirection(enemy, 3.14)
          this.shootInDirection(enemy, 3.14 + 1.57)
        }
        case "keepMovement" {
          // Do nothing and keep velocity as normal
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

  shootInDirection(enemy, direction) {
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
      function (enemy, projectile) {
        if (enemy.hitList[projectile.id]) {
          return
        }
        enemy.hitList[projectile.id] = true

        if (projectile.weaponType == "rocket") {
          enemy.health -= this.gameScene.plrDamage * 2.2
        } else {
          enemy.health -= this.gameScene.plrDamage * 4.5
        }

        enemy.setAlpha(0.1 + enemy.health / enemy.stats.maxHealth)

        if (enemy.health <= 0) {
          this.gameScene.plrXp += enemy.stats.xp
          enemy.destroy()
          return
        }
      }.bind(this)
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
    enm.damage = 15
    enm.projectileKey = "rocket"
    enm.projectileSize = 40
    enm.projectileSpeed = 90
    enm.projectileDistance = 2000
    enm.spriteKey = "goose"
    enm.spriteSize = 70
    enm.xp = 40
    enm.actionLoop = ["advance", "shoot", "retreat", "retreat"]
    enm.actionSpeed = 400

    // BULK
    this.EnemyList["bulk"] = this.newEnemy()
    enm = this.EnemyList["bulk"]
    enm.maxHealth = 200
    enm.moveAmount = 60
    enm.damage = 45
    enm.projectileKey = "bulkFist"
    enm.projectileSize = 80
    enm.projectileSpeed = 200
    enm.projectileDistance = 100
    enm.spriteKey = "amazingBulk"
    enm.spriteSize = 110
    enm.xp = 100
    enm.actionLoop = ["advance", "shoot", "advance", "advance", "shoot"]
    enm.actionSpeed = 370

    // WARRIOR
    this.EnemyList["warrior"] = this.newEnemy()
    enm = this.EnemyList["warrior"]
    enm.maxHealth = 120
    enm.moveAmount = 90
    enm.damage = 25
    enm.projectileKey = "mace"
    enm.projectileSize = 50
    enm.projectileSpeed = 50
    enm.projectileDistance = 80
    enm.spriteKey = "warrior"
    enm.spriteSize = 70
    enm.xp = 50
    enm.actionLoop = ["advance", "shoot", "advance"]
    enm.actionSpeed = 400

    // MEGA KNIGHT
    this.EnemyList["megaKnight"] = this.newEnemy()
    enm = this.EnemyList["megaKnight"]
    enm.maxHealth = 550
    enm.moveAmount = 300
    enm.damage = 90
    enm.projectileKey = "megaFist"
    enm.projectileSize = 130
    enm.projectileSpeed = 400
    enm.projectileDistance = 120
    enm.spriteKey = "megaKnight"
    enm.spriteSize = 130
    enm.xp = 500
    enm.actionLoop = ["advance", "idle", "idle", "idle", "idle", "idle", "advance", "advance", "advance", "shoot", "shoot"]
    enm.actionSpeed = 300
    enm = null

    // GATLING PEA
    this.EnemyList["gatlingPea"] = this.newEnemy()
    enm = this.EnemyList["gatlingPea"]
    enm.maxHealth = 250
    enm.moveAmount = 0
    enm.damage = 20
    enm.projectileKey = "pea"
    enm.projectileSize = 50
    enm.projectileSpeed = 370
    enm.projectileDistance = 1500
    enm.spriteKey = "gatlingPea"
    enm.spriteSize = 130
    enm.xp = 110
    enm.actionLoop = ["shoot", "shoot", "shoot", "shoot", "shoot", "idle", "tripleShot", "idle"]
    enm.actionSpeed = 250
    enm = null

    // TRIPLE PEA
    this.EnemyList["triplePea"] = this.newEnemy()
    enm = this.EnemyList["triplePea"]
    enm.maxHealth = 250
    enm.moveAmount = 0
    enm.damage = 20
    enm.projectileKey = "pea"
    enm.projectileSize = 50
    enm.projectileSpeed = 370
    enm.projectileDistance = 1500
    enm.spriteKey = "triplePea"
    enm.spriteSize = 130
    enm.xp = 100
    enm.actionLoop = ["idle", "idle", "tripleShot"]
    enm.actionSpeed = 250
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
    // WAVE 5
    this.waves.push(["megaKnight"])
    // WAVE 6
    this.waves.push(["triplePea","triplePea","bulk","bulk","bulk"])

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
