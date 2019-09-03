import 'phaser'
import { MainScene } from './scenes/mainScene'

const gameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 768,
  physics: {
    default: 'arcade'
  },
  scene: MainScene
}
const game = new Phaser.Game(gameConfig)
