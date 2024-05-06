/* global Phaser */

const config = {
  type: Phaser.AUTO,
  scale: {
      mode: Phaser.Scale.FIT,
      parent: 'phaser-example',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
  },
  backgroundColor: 0x555555
}

const game = new Phaser.Game(config);
console.log(game);
