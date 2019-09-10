import { GameObjects } from 'phaser'
import generateUID from '../utils/uid'
import HealthBar from './healthBar';

export class Enemy extends GameObjects.Ellipse {
  constructor (scene, color) {
    super(scene, 700, 600, 75, 75, color)
    this.uid = generateUID()
    this.scene = scene

    //  this.healthText = scene.add.text(this.x - 12, this.y - 60, '', {
    //     color: '#000000'
    //   })
    }
    
    get position () {
      return { x: this.x, y: this.y }
    }
    
    setHealth (health) {
      this.maxHealth = health
      this.currentHealth = health
      this.healthBar = new HealthBar(this.scene, this.position, this.displayHeight, this.maxHealth)
  }

  receiveDamage (projectile) {
    this.currentHealth -= projectile.power
    this.healthBar.updateHealth(this.currentHealth)
  }

  update (time, delta) {
    this.checkHealth()
    this.move(delta, this.scene.player.position)
    this.healthBar.updatePosition(this.position)
    // this.healthText.setText(`${this.currentHealth.toFixed(0)}`)
    // this.healthText.setPosition(this.x - 12, this.y - 60)
  }

  move (delta, { x, y }) {
    let direction = new Phaser.Math.Vector2(this.x - x, this.y - y)
    direction = direction.normalize()

    const speedX = direction.x * this.baseSpeed
    const speedY = direction.y * this.baseSpeed
    this.setX(this.x - speedX)
    this.setY(this.y - speedY)
  }

  spawn (x, y) {
    this.setPosition(x, y)
    this.setVisible(true)
    this.setActive(true)
    // this.healthText.setVisible(true)
    this.healthBar.updateHealth(this.currentHealth)
    this.healthBar.draw(true)
  }

  checkHealth () {
    // this.healthText.setText(`${this.currentHealth.toFixed(0)}`)
    if (this.currentHealth <= 0) {
      this.die()
    }
  }

  die () {
    this.scene.enemies.killAndHide(this)
    // this.healthText.setVisible(false)
    this.currentHealth = this.maxHealth
    this.setPosition(-500, -500)
    this.scene.killEmmiter.emit('enemyKilled', this)
    this.healthBar.hide()
  }
}

export class PurpleEnemy extends Enemy {
  constructor (scene) {
    super(scene, 0xff00ff)
    this.setName('Purple')

    this.setHealth(55)
    this.baseSpeed = 0.8
    this.damage = 15
    this.experience = 1
  }
}
