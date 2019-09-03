export function angleBetweenPoints (x0, y0, x1, y1) {
  return Math.atan((y1 - y0) / (x1 - x0))
}

export class Vector {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.length = Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize () {
    this.x = this.x / this.length
    this.y = this.y / this.length
  }
}

export class NormalizedVector extends Vector {
  constructor (x, y) {
    super(x, y)
    this.normalize()
  }
}
