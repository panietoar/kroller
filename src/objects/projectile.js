import { GameObjects } from 'phaser'
import generateUID from '../utils/uid'

export default class Projectile extends GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'projectile')
    this.uid = generateUID()
    this.baseSpeed = 0.3
    this.scene = scene
    this.power = 20
    this.exploding = false
    this.setName('projectile')
    this.anims.play('fired')
  }

  fire(x, y, direction) {
    this.setPosition(x, y)
    this.direction = direction
    this.setActive(true)
    this.setVisible(true)
  }

  explode() {
    this.exploding = true
    this.anims.play('explosion')
    this.setActive(false)
    this.setVisible(false)
  }

  update(delta) {
    if(!this.exploding) {
      this.updatePosition(delta)
      this.checkBounds()
    }
  }

  updatePosition(delta) {
    const speed = delta * this.baseSpeed
    const speedX = this.direction.x * speed
    const speedY = this.direction.y * speed
    this.setX(this.x + speedX)
    this.setY(this.y + speedY)
  }

  checkBounds() {
    if (this.isOutOfBounds()) {
      this.setActive(false)
      this.setVisible(false)
    }
  }

  isOutOfBounds() {
    return this.x > 1280 || this.x < 0 || this.y > 768 || this.y < 0
  }
}
