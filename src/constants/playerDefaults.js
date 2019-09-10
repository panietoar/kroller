export const HEALTH = {
  mage: 40,
  warrior: 100,
  rogue: 60,
  cleric: 80
}

export const SPEED = {
  mage: 100,
  warrior: 1,
  rogue: 1,
  cleric: 1
}

export const LEVELS = {

}

export function nextLevel(level){
  return Math.round(0.04 * Math.pow(level, 3) + 0.8 * Math.pow(level, 2) + 2 * level)
}