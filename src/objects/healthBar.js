import { GameObjects } from 'phaser'

export default class HealthBar extends GameObjects.Rectangle {
  constructor (scene, position, yOffset, maxHealth) {
    super(scene, 0, 0, 50, 8, 0x00ff00)
    this.maxHealth = maxHealth
    this.scene = scene
    this.yOffset = yOffset
    this.scene.add.existing(this)
    this.setVisible(false)
  }

  draw () {
    this.setVisible(true)
  }

  hide () {
    this.setVisible(false)
  }

  updatePosition ({ x, y }) {
    this.setPosition(x, y + this.yOffset)
  }

  calcLength (newHealth) {
    return (newHealth / this.maxHealth).toFixed(1)
  }

  updateHealth (currentHealth) {
    const normalizedLength = this.calcLength(currentHealth)
    let tween = this.scene.tweens.add({
      targets: this,
      scaleX: normalizedLength,
      duration: 500,
      ease: 'Power2'
    })
    if (normalizedLength > 0.5) {
      this.setFillStyle(0x00ff00)
    } else if (normalizedLength > 0.15) {
      this.setFillStyle(0xffa500)
    } else {
      this.setFillStyle(0xff0000)
    }
  }
}
