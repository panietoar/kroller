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

  get angle() {
    return Math.atan2(this.y, this.x)
  }
}

export class NormalizedVector extends Vector {
  constructor (x, y) {
    super(x, y)
    this.normalize()
  }
}
