import Node from './node'

//饼状图
export default class Rect extends Node {

  radius: number = 6

  constructor() {
    super()
    this.type = 'rect'
  }

  paintTitle(context: CanvasRenderingContext2D) {
    //绘制名称
    context.fillText(this.name, this.x, this.y)
  }

  // 使用缓存
  // paintCache(context: CanvasRenderingContext2D) {
  //   if (this.cache) {

  //   }
  // }

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
    context.moveTo(x + this.radius, y)
    context.arcTo(x + this.width, y, x + this.width, y + this.height, this.radius)
    context.arcTo(x + this.width, y + this.height, x, y + this.height, this.radius)
    context.arcTo(x, y + this.height, x, y, this.radius)
    context.arcTo(x, y, x + this.width, y, this.radius)

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
