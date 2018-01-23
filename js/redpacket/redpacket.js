import Animation from '../base/animation'
import DataBus from '../databus'

// const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_IMG_SRC = 'images/redpacket/red_packet_01.png'
const ENEMY_WIDTH = 60
// const ENEMY_HEIGHT  = 60
const ENEMY_HEIGHT = 80

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

let atlas = new Image()
atlas.src = 'images/Common.png'
export default class Enemy extends Animation {
  constructor(ctx) {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

    // 初始化事件监听
    this.initEvent(ctx)
    this.initExplosionAnimation()
  }

  init(speed) {
    this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
    this.y = -this.height

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在红包上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在红包上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(x >= this.x - deviation
      && y >= this.y - deviation
      && x <= this.x + this.width + deviation
      && y <= this.y + this.height + deviation)
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      if (this.checkIsFingerOnAir(x, y)) {
        // 点击到红包，游戏结束
        databus.gameOver = true
      }

    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()

    }).bind(this))
  }

  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + this.height)
      databus.removeEnemey(this)
  }
}
