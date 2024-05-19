// For Bars and Buttons
import UIhandler from "./UIhandler.js"

// UPGRADE SCENE
class UpgradeScene extends Phaser.Scene {
  // Constructor, called upon "new"
  constructor() {
    super({ key: "upgradeScene" })
  }

  // Initializer, called upon "start"
  init(data) {

  }

  // Preload, for loading assets
  preload() {

  }

  // Create, happens after preload() is complete
  create(data) {
    // UI HANDLER
    this.UI = new UIhandler(this)
    // Get GameScene
    this.gameScene = this.scene.get('gameScene');

    // For Reference, initial stats
    // // PLAYER STATS
    // let playerStats = {}
    // playerStats.speed = 200
    // playerStats.attackSpeed = 1000
    // playerStats.maxHealth = 100
    // playerStats.damage = 10
    // playerStats.xp = 0
    // playerStats.level = 0
    
    this.maxStats = {
      "plrDamage": 35,
      "plrAttackSpeed": 3,
      "plrMaxHealth": 1000,
      "plrSpeed": 600,
    }

    this.statUpgrades = {
      "plrDamage": 2.5,
      "plrAttackSpeed": 0.2,
      "plrMaxHealth": 100,
      "plrSpeed": 40,
    }

    this.upgradeScreen = this.add.image(400, 300, "upgradeScreen")
    this.upgradeScreen.setScale(1)

    // ADD BARS
    this.addBar(128, "plrDamage", 0xff0000)
    this.addBar(199, "plrAttackSpeed", 0xffff00)
    this.addBar(270, "plrMaxHealth", 0x00ff00)
    this.addBar(341, "plrSpeed", 0x0000ff)
  }

  // Delta update loop, loops whilst the scene is active
  // delta approximately = 1/fps  [ the time that has passed since the last frame (ms) ]
  // time = amount of the time the game has been running ( milliseconds )
  update(time, delta) {

  }

  addBar(posY, stat, color) {
    let posX = 145
    let width = 250
    let height = 32
    let bar = this.UI.createBar(posX, posY - 16, width, height, stat)
    bar.setFillStyle(color)
    
    // hide text away from screen
    bar.text.x = 2000

    // Show progress of bar
    bar.update(this.maxStats[stat], this.gameScene[stat])

    // ADD UPGRADE BUTTON NEXT TO BAR
    let upgradeButton = this.UI.createButton(posX + width + 16, posY, " + ", function () {
      if (this.gameScene[stat] >= this.maxStats[stat]) {return}
      else {
        // Add upgrade to stat
        this.gameScene[stat] += this.statUpgrades[stat]
        
        // Go back to game Scene
        this.scene.resume('gameScene');

        // SET HP TO MAX HP, INCASE OF HP UPGRADE
        this.gameScene.plrHealth = this.gameScene.plrMaxHealth
        
        this.scene.stop();
      }
    }.bind(this))

    // IF UPGRADE IS MAX
    if (this.gameScene[stat] >= this.maxStats[stat]) {
      upgradeButton.setText("MAX")
    }
  }
}

export default UpgradeScene
