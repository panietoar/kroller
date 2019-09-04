import { GameObjects } from 'phaser'
import generateUID from '../utils/uid'
import { NormalizedVector } from '../utils/geometry'

export class Enemy extends GameObjects.Ellipse {
  constructor (scene, color) {
    super(scene, 700, 600, 75, 75, color)
    this.uid = generateUID()
    this.scene = scene

    this.healtText = scene.add.text(
      this.x - 12,
      this.y - 60,
      '',
      {
        color: '#000000'
      }
    )
  }

  receiveDamage (projectile) {
    this.health -= projectile.power
  }

  update (delta, playerPosition) {
    this.checkHealth()
    this.move(delta, playerPosition)
    this.healtText.setText(`${this.health.toFixed(0)}`)
    this.healtText.setPosition(this.x - 12, this.y - 60)
  }

  move (delta, { x, y }) {
    let direction = new NormalizedVector(this.x - x, this.y - y)
    const speed = delta * this.baseSpeed
    const speedX = direction.x * speed
    const speedY = direction.y * speed
    this.setX(this.x - speedX)
    this.setY(this.y - speedY)
  }

  checkHealth () {
    this.healtText.setText(`${this.health.toFixed(0)}`)
    if (this.health <= 0) {
      //this.scene.killEmmiter.emit('enemyKilled', this)
      this.scene.removeEnemy(this)
      this.healtText.destroy()
    }
  }
}

export class PurpleEnemy extends Enemy {
  constructor (scene) {
    super(scene, 0xff00ff)
    this.setName('Purple')

    this.health = 40
    this.baseSpeed = 0.1
    this.damage = 15
  }
}
