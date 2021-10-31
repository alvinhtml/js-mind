import { Text, Rect, Circle, Diamond } from "./node/index"
import Stage from "./stage"

// import Point from './point'
type Node = Rect | Circle | Diamond | Text

export type Position = 'top' | 'right' | 'bottom' | 'left'

interface Point {
  x: number,
  y: number
}


class Line {
  node: Node
  toNode: Node
  p1: Point
  p2: Point
  type: string
  arrow: boolean

  constructor(node: Node, startPosition: Position, toNode: Node, endPosition: Position, space: number) {
    this.node = node
    this.toNode = toNode

    this.p1 = this.getPointOffset(startPosition, node, space)
    this.p2 = this.getPointOffset(endPosition, toNode, space)
  }

  getPointOffset(orient: string, node: Node, space: number): Point {
    if (orient === 'bottom') {
      return {
        x: node.x,
        y: (node.height / 2) + space
      }
    }

    if (orient === 'top') {
      return {
        x: node.x,
        y: - (node.height / 2) - space
      }
    }

    if (orient === 'left') {
      return {
        x: - (node.width / 2) - space,
        y: node.y
      }
    }

    if (orient === 'right') {
      return {
        x: (node.width / 2) + space,
        y: node.y
      }
    }

    return {
      x: node.x,
      y: node.y
    }
  }
}

let timer = 0

export default class Liner {
  stage2d: Stage

  list: Array<Line> = []

  cached: boolean = false

  space: number = 8

  // 箭头长度
  headlen: number = 8

  // 箭头线与直线的夹角
  theta: number = 30

  context: CanvasRenderingContext2D
  canvas: HTMLCanvasElement

  constructor(stage2d: Stage) {
    this.stage2d = stage2d

    const canvas = document.createElement('canvas')
    canvas.width = this.stage2d.width
    canvas.height = this.stage2d.height
    this.canvas = canvas

    // document.body.appendChild(canvas)

    const context = canvas.getContext('2d')

    if (context) {
      this.context = context
      this.context.strokeStyle = '#ffffff'
  		this.context.lineJoin = 'bevel'
      this.context.lineCap = 'round'
  		this.context.miterLimit = 1
  		this.context.textAlign = 'center'
  		this.context.textBaseline = 'middle'
  		this.context.fillStyle = 'red'
  		this.context.lineWidth = 2
  		this.context.font = '14px Tahoma, Geneva, sans-serif'
    }
  }

  addLine(node: Node, startPosition: Position, toNode: Node, endPosition: Position): Line {
    const line = new Line(node, startPosition, toNode, endPosition, this.space)
    this.list.push(line)
    return line
  }

  paint(context: CanvasRenderingContext2D) {
    // 当有缓存的时候，使用缓存
    if (this.cached) {
      const pixelRatio = this.stage2d.pixelRatio
      context.drawImage(this.canvas, -this.stage2d.translateX * 2, -this.stage2d.translateY* 2, this.stage2d.width * pixelRatio, this.stage2d.height * pixelRatio)
    } else {
        const pixelRatio = this.stage2d.pixelRatio
        // beginPath 使用不正确会导致 clearRect 无效
        this.context.save()
        this.context.translate(this.stage2d.translateX, this.stage2d.translateY)
        this.context.clearRect(- this.stage2d.translateX, - this.stage2d.translateY, this.stage2d.width * pixelRatio, this.stage2d.height * pixelRatio)


        this.context.beginPath()
        this.list.forEach((line: Line) => {
          this.context.moveTo(0, 0)
          this.paintLine(this.context, line)
          this.context.moveTo(0, 0)

        })

        this.context.strokeStyle = '#7396bf'
        this.context.closePath()
        this.context.stroke()
        this.context.restore()

        // this.cached = true
        context.drawImage(this.canvas, -this.stage2d.translateX * 2, -this.stage2d.translateY* 2, this.stage2d.width * pixelRatio, this.stage2d.height * pixelRatio)
    }
  }

  paintLine(context: CanvasRenderingContext2D, line: Line) {
    const p1x = line.node.x + line.p1.x
    const p1y = line.node.y + line.p1.y
    const p2x = line.toNode.x + line.p2.x
    const p2y = line.toNode.y + line.p2.y

    context.moveTo(p1x, p1y)
    context.lineTo(p2x, p2y)

    if (line.arrow) {
      this.paintLineArrow(context, p1x, p1y, p2x, p2y)
    }
  }


  // 绘制三次贝赛尔曲线
  paintBezierLine(context: CanvasRenderingContext2D, orient: string, node: Node, toNode: Node) {
    const space = 8

    if (orient === 'bottom') {
      const x1 = node.x
      const y1 = node.y + (node.height / 2) + space
      const x2 = toNode.x
      const y2 = toNode.y - (toNode.height / 2) - space

      context.moveTo(x1, y1)
      context.bezierCurveTo(x1, y1 + (y2 - y1) / 2, x2, y2 - (y2 - y1) / 2, x2, y2)
    }

    if (orient === 'top') {
      const x1 = node.x
      const y1 = node.y - (node.height / 2) - space
      const x2 = toNode.x
      const y2 = toNode.y + (toNode.height / 2) + space

      context.moveTo(x1, y1)
      context.bezierCurveTo(x1, y1 + (y2 - y1) / 2, x2, y2 - (y2 - y1) / 2, x2, y2)
    }

    if (orient === 'right') {
      const x1 = node.x + (node.width / 2) + space
      const y1 = node.y
      const x2 = toNode.x - (toNode.width / 2) - space
      const y2 = toNode.y

      context.moveTo(x1, y1)
      context.bezierCurveTo(x1 + (x2 - x1) / 2, y1, x2 - (x2 - x1) / 2, y2, x2, y2)
    }

    if (orient === 'left') {
      const x1 = node.x - (node.width / 2) - space
      const y1 = node.y
      const x2 = toNode.x + (toNode.width / 2) + space
      const y2 = toNode.y

      context.moveTo(x1, y1)
      context.bezierCurveTo(x1 + (x2 - x1) / 2, y1, x2 - (x2 - x1) / 2, y2, x2, y2)
    }
  }

  // 绘制折线
  paintBrokenLine(context: CanvasRenderingContext2D, line: Line) {
    // const p1 = this.getPointOffset(line.startPosition, line.node)
    // const p2 = this.getPointOffset(line.endPosition, line.toNode)
    //
    // const pA = {
    //   x: 0,
    //   y: 0
    // }
    //
    // const pB = {
    //   x: 0,
    //   y: 0
    // }
    //
    //
    // // if () {
    // //
    // // }
    //
    //
    // const py = p1.y + (p2.y - p1.y) / 2
    //
    // context.moveTo(p1.x, p1.y)
    // context.lineTo(p1.x, py)
    // context.lineTo(p2.x, py)
    // context.lineTo(p2.x, p2.y)
    //
    // if (line.arrow) {
    //   this.paintLineArrow(context, p2.x, py, p2.x, p2.y)
    // }




    // const space = 8
    //
    // if (orient === 'bottom') {
    //   const p1.x = node.x
    //   const y1 = node.y + (node.height / 2) + space
    //   const x2 = toNode.x
    //   const y2 = toNode.y - (toNode.height / 2) - space
    //
    //   context.moveTo(x1, y1)
    //   context.lineTo(x1, y1 + (y2 - y1) / 2)
    //   context.lineTo(x2, y1 + (y2 - y1) / 2)
    //   context.lineTo(x2, y2)
    // }
    //
    // if (orient === 'top') {
    //   const x1 = node.x
    //   const y1 = node.y - (node.height / 2) - space
    //   const x2 = toNode.x
    //   const y2 = toNode.y + (toNode.height / 2) + space
    //
    //   context.moveTo(x1, y1)
    //   context.lineTo(x1, y1 + (y2 - y1) / 2)
    //   context.lineTo(x2, y1 + (y2 - y1) / 2)
    //   context.lineTo(x2, y2)
    // }
    //
    // if (orient === 'right') {
    //   const x1 = node.x + (node.width / 2) + space
    //   const y1 = node.y
    //   const x2 = toNode.x - (toNode.width / 2) - space
    //   const y2 = toNode.y
    //
    //   context.moveTo(x1, y1)
    //   context.lineTo(x1 + (x2 - x1) / 2, y1)
    //   context.lineTo(x1 + (x2 - x1) / 2, y2)
    //   context.lineTo(x2, y2)
    // }
    //
    // if (orient === 'left') {
    //   const x1 = node.x - (node.width / 2) - space
    //   const y1 = node.y
    //   const x2 = toNode.x + (toNode.width / 2) + space
    //   const y2 = toNode.y
    //
    //   context.moveTo(x1, y1)
    //   context.lineTo(x1 + (x2 - x1) / 2, y1)
    //   context.lineTo(x1 + (x2 - x1) / 2, y2)
    //   context.lineTo(x2, y2)
    // }


  }

  paintLineArrow(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
    // 箭头线终点坐标
    let arrowX
    let arrowY

    // 计算各角度和对应的箭头终点坐标
    const angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI
    const angle1 = (angle + this.theta) * Math.PI / 180
    const angle2 = (angle - this.theta) * Math.PI / 180
    const topX = this.headlen * Math.cos(angle1)
    const topY = this.headlen * Math.sin(angle1)
    const botX = this.headlen * Math.cos(angle2)
    const botY = this.headlen * Math.sin(angle2)

    arrowX = toX + topX
    arrowY = toY + topY

    //画上边箭头线
    context.moveTo(arrowX, arrowY)
    context.lineTo(toX, toY)

    arrowX = toX + botX
    arrowY = toY + botY

    //画下边箭头线
    context.lineTo(arrowX, arrowY)
  }

  clearLine() {
    this.list.length = 0
  }

  clearCache() {
    this.cached = false
    window.clearTimeout(timer)
    // 400 ms 后使缓存画布
    timer = window.setTimeout(() => {
      this.cached = true
    }, 600)
  }
}
