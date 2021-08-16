import Node from './node'

//饼状图
export default class Rect extends Node {

  radius: number = 6

  constructor() {
    super()
    this.type = 'pie'
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

  }
  paint(context: CanvasRenderingContext2D) {
    console.log("this,width", this.width);
    if (this.width < 2 * this.radius) {
      this.radius = this.width / 2;
    }

    if (this.height < 2 * this.radius) {
      this.radius = this.height / 2
    }

    context.beginPath()
    context.moveTo(this.x + this.radius, this.y)
    context.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, this.radius)
    context.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, this.radius)
    context.arcTo(this.x, this.y + this.height, this.x, this.y, this.radius)
    context.arcTo(this.x, this.y, this.x + this.width, this.y, this.radius)

    // context.rect(this.x, this.y, this.width, this.height);
    context.closePath()

    context.fill()
    context.stroke()
  }
}
