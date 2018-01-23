// import Player     from './player/index'
import Redpacket from './redpacket/redpacket'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'

let ctx = canvas.getContext('2d')
let databus = new DataBus()

let atlas = new Image()
atlas.src = 'images/redpacket/card_bg.png'
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    // this.player   = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Redpacket)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      // let enemy = databus.enemys[i]

      // if ( this.player.isCollideWith(enemy) ) {
      //   databus.gameOver = true

      //   break
      // }
    }
  }

  //游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    databus.reset()
    let screenWidth = canvas.width
    let screenHeight = canvas.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.bg.render(ctx)
    ctx.drawImage(atlas, 0, 120, canvas.width, 260)
    ctx.fillStyle = "#ffffff"
    ctx.font = "38px Arial"
    ctx.fillText(
      '恭喜您!',
      canvas.width / 2 - 55,
      canvas.height / 2 - 160
    )
    ctx.fillText(
      '200.00',
      canvas.width / 2 - 65,
      canvas.height / 2 - 50
    )
    ctx.fillStyle = "#ffffff"
    ctx.font = "16px Arial"
    ctx.fillText('元',
      canvas.width / 2 + 60,
      canvas.height / 2 - 50)
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    // this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)
  }

  // 游戏逻辑更新主函数
  update() {
    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()

    this.collisionDetection()
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    if (databus.frame % 20 === 0) {
      // this.player.shoot()
      // this.music.playShoot()
    }

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      this.touchHandler = this.touchEventHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)

      return
    }

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
}
