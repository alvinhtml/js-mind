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

    context.arc(this.x, this.y, 40, 0, 2 * Math.PI)

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
