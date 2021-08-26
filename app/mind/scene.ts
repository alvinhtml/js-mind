import Stage from './stage';

// 场景<Scene>：元素
export default class Scene {
  stage2d: Stage
  context: CanvasRenderingContext2D
  canvas: HTMLCanvasElement

  constructor(stage2d: Stage) {
    this.stage2d = stage2d

    //创建 Canvas，并添加到场景
    const canvas = document.createElement('canvas')
    canvas.width = stage2d.width
    canvas.height = stage2d.height
    canvas.style.position = 'absolute'

    this.stage2d.container.appendChild(canvas)

    this.canvas = canvas

    const context = canvas.getContext('2d')

    if (context) {
      this.context = context
    }
  }

  initContext() {
    this.context.strokeStyle = '#ffffff'
		this.context.lineJoin = 'bevel'
    this.context.lineCap = 'round'
		this.context.miterLimit = 1
		this.context.textAlign = 'center'
		this.context.textBaseline = 'middle'
		this.context.fillStyle = '#ffffff'
  }

  paint(fn: Function) {
    const frame = () => {
      // 判断浏览器选项卡的内容是否可见
      if (this.stage2d.isVisibility) {
        const {width, height, translateX, translateY, scale} = this.stage2d

        //清理画面
        this.context.clearRect(0, 0, width, height)


        //重置画布的透明度
        this.context.globalAlpha = 1

        // console.time('scene paint time')
        this.context.save()

        //重新设定画布偏移和缩放
        this.context.translate(translateX, translateY)

        // 背景网格
        // this.paintGrid()

        this.context.scale(scale, scale)


        fn(this.context)


        this.context.restore()

        this.stage2d.dispatchTarget(null)
        this.stage2d.dispatchEvent()
        // console.timeEnd('scene paint time')
      }

      //需要重复绘制的内容
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  paintGrid() {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.05)'

    for (let j = -10; j < 10; j++) {
      for (let i = -10; i < 10; i++) {
        this.context.fillRect(200 * i, 200 * j, 100, 100)
      }
    }

    for (let j = -10; j < 10; j++) {
      for (let i = -10; i < 10; i++) {
        this.context.fillRect(200 * i + 100, 200 * j + 100, 100, 100)
      }
    }

    this.context.fillStyle = 'red'
    this.context.fillRect(-1, -1, 2, 2)
  }

  paintOnce(fn: Function) {
    const frame = () => {
      // 判断浏览器选项卡的内容是否可见
      if (this.stage2d.isVisibility) {
        const {width, height, translateX, translateY, scale} = this.stage2d

        //清理画面
        this.context.clearRect(0, 0, width, height)

        //重置画布的透明度
        this.context.globalAlpha = 1

        this.context.save()

        //重新设定画布偏移和缩放
        this.context.translate(translateX, translateY)

        this.context.scale(scale, scale)

        fn(this.context)

        this.context.restore()
      }
    }

    requestAnimationFrame(frame);
  }
}
