import { GameObjects } from 'phaser'
import generateUID from '../utils/uid'
import { NormalizedVector } from '../utils/geometry'

export class Enemy extends GameObjects.Ellipse {
  constructor (scene, color) {
    super(scene, 700, 600, 75, 75, color)
    this.uid = generateUID()
    this.scene = scene

    this.healtText = scene.add.text(this.x - 12, this.y - 60, '', {
      color: '#000000'
    })
  }

  receiveDamage (projectile) {
    this.health -= projectile.power
  }

  update (time, delta) {
    this.checkHealth()
    this.move(delta, this.scene.player.position)
    this.healtText.setText(`${this.health.toFixed(0)}`)
    this.healtText.setPosition(this.x - 12, this.y - 60)
  }

  move (delta, { x, y }) {
    let direction = new NormalizedVector(this.x - x, this.y - y)

    const speedX = direction.x * this.baseSpeed
    const speedY = direction.y * this.baseSpeed
    this.setX(this.x - speedX)
    this.setY(this.y - speedY)
  }

  spawn (x, y) {
    this.setPosition(x, y)
    this.setVisible(true)
    this.setActive(true)
    this.healtText.setVisible(true)
  }

  checkHealth () {
    this.healtText.setText(`${this.health.toFixed(0)}`)
    if (this.health <= 0) {
      this.die()
    }
  }

  die () {
    this.scene.enemies.killAndHide(this)
    this.healtText.setVisible(false)
    this.health = 40
    this.setPosition(-500, -500)
    this.scene.killEmmiter.emit('enemyKilled', this)
  }
}

export class PurpleEnemy extends Enemy {
  constructor (scene) {
    super(scene, 0xff00ff)
    this.setName('Purple')

    this.health = 40
    this.baseSpeed = 0.8
    this.damage = 15
  }
}
