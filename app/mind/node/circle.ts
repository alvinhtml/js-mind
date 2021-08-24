import Node from './node'

//饼状图
export default class Circle extends Node {

  radius: number = 6

  width: number = 60

  height: number = 60

  constructor() {
    super()
    this.type = 'circle'
  }

  //点击动画
  clickAnimate() {
    // //计算饼形中线弧度
    // const radian = (this.eAngle - this.sAngle) / 2 + this.sAngle + (0.5 * Math.PI)
    //
    // //计算移动后的圆心坐标
    // const x = this.x + Math.sin(radian) * 10
    // const y = this.y - Math.cos(radian) * 10
    //
    // //先记录当前 shape 和圆心坐标，复原时用
    // this.chart2d.addRecoverShapes(this, {
    //   x: this.x,
    //   y: this.y
    // })
    //
    // //开始播放移动动画
    // this.animate({
    //   x,
    //   y
    // })
    //
    // this.recoverAnimateIng = true
  }

  paintTitle(context: CanvasRenderingContext2D) {
    //绘制名称
    context.fillText(this.name, this.x, this.y)
  }
  paint(context: CanvasRenderingContext2D) {
    if (this.width < 2 * this.radius) {
      this.radius = this.width / 2;
    }

    if (this.height < 2 * this.radius) {
      this.radius = this.height / 2
    }

    const x = this.x - (this.width / 2)
    const y = this.y - (this.height / 2)

    context.beginPath()

    context.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);

    // context.rect(this.x, this.y, this.width, this.height);
    context.closePath()

    if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
      context.fillStyle = this.mouseOverPattern
      this.triggerEvent()
    } else {
      context.fillStyle = this.pattern
    }

    context.fillStyle = this.areaPattern
    context.strokeStyle = this.pattern

    context.fill()
    context.stroke()
  }
}
