import Stage from './stage';

// 场景<Scene>：元素
export default class Scene {
  stage2d: Stage
  context: CanvasRenderingContext2D

  constructor(stage2d: Stage) {
    this.stage2d = stage2d

    //创建 Canvas，并添加到场景
    const canvas = document.createElement('canvas')
    canvas.width = stage2d.width
    canvas.height = stage2d.height
    canvas.style.position = 'absolute'

    this.stage2d.container.appendChild(canvas)


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

        this.context.save()

        //重新设定画布偏移和缩放
        this.context.translate(translateX, translateY)

        this.context.scale(scale, scale)

        fn(this.context)

        this.context.restore()

        this.stage2d.clearEventPoint()
      }

      //需要重复绘制的内容
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
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
