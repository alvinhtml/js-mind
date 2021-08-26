import Node from './node'

//饼状图
export default class Diamond extends Node {

  radius: number = 6

  constructor() {
    super()
    this.type = 'diamond'
  }

  paintTitle(context: CanvasRenderingContext2D) {
    //绘制名称
    context.fillText(this.name, this.x, this.y)
  }
  paint(context: CanvasRenderingContext2D) {

    context.beginPath()
    context.moveTo(this.x, this.y - this.height / 2)
    context.lineTo(this.x + this.width / 2, this.y)
    context.lineTo(this.x, this.y + this.height / 2)
    context.lineTo(this.x - this.width / 2, this.y)

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
