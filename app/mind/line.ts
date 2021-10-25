import { Text, Rect, Circle, Diamond } from "./node/index"
type Node = Rect | Circle | Diamond | Text

export type Position = 'top' | 'right' | 'bottom' | 'left'

interface Line {
  node: Node
  startPosition: Position
  toNode: Node
  endPosition: Position
  type: string
  arrow: boolean
}

interface Point {
  x: number
  y: number
}

class Liner {
  list: Array<Line> = []

  cached: boolean = false

  space: number = 8

  // 箭头长度
  headlen: number = 8

  // 箭头线与直线的夹角
  theta: number = 30

  addLine(line: Line) {
    this.list.push({
      node: line.node,
      startPosition: line.startPosition,
      toNode: line.toNode,
      endPosition: line.endPosition,
      type: line.type,
      arrow: line.arrow
    })
  }

  paint(context: CanvasRenderingContext2D) {
    this.list.forEach((line: Line) => {
      console.log("line", line);
      context.moveTo(0, 0)
      this.paintLine(context, line)
      context.moveTo(0, 0)

      context.strokeStyle = '#7396bf'

      context.stroke()
    })
  }

  paintLine(context: CanvasRenderingContext2D, line: Line) {
    const p1 = this.getPoint(line.startPosition, line.node)
    const p2 = this.getPoint(line.endPosition, line.toNode)

    context.moveTo(p1.x, p1.y)
    context.lineTo(p2.x, p2.y)

    if (line.arrow) {
      this.paintLineArrow(context, p1.x, p1.y, p2.x, p2.y)
    }
  }

  getPoint(orient: string, node: Node): Point {
    if (orient === 'bottom') {
      return {
        x: node.x,
        y: node.y + (node.height / 2) + this.space
      }
    }

    if (orient === 'top') {
      return {
        x: node.x,
        y: node.y - (node.height / 2) - this.space
      }
    }

    if (orient === 'left') {
      return {
        x: node.x - (node.height / 2) - this.space,
        y: node.y
      }
    }

    if (orient === 'right') {
      return {
        x: node.x + (node.height / 2) + this.space,
        y: node.y
      }
    }

    return {
      x: node.x,
      y: node.y
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
  paintBrokenLine(context: CanvasRenderingContext2D, orient: string, node: Node, toNode: Node) {
    const space = 8

    if (orient === 'bottom') {
      const x1 = node.x
      const y1 = node.y + (node.height / 2) + space
      const x2 = toNode.x
      const y2 = toNode.y - (toNode.height / 2) - space

      context.moveTo(x1, y1)
      context.lineTo(x1, y1 + (y2 - y1) / 2)
      context.lineTo(x2, y1 + (y2 - y1) / 2)
      context.lineTo(x2, y2)
    }

    if (orient === 'top') {
      const x1 = node.x
      const y1 = node.y - (node.height / 2) - space
      const x2 = toNode.x
      const y2 = toNode.y + (toNode.height / 2) + space

      context.moveTo(x1, y1)
      context.lineTo(x1, y1 + (y2 - y1) / 2)
      context.lineTo(x2, y1 + (y2 - y1) / 2)
      context.lineTo(x2, y2)
    }

    if (orient === 'right') {
      const x1 = node.x + (node.width / 2) + space
      const y1 = node.y
      const x2 = toNode.x - (toNode.width / 2) - space
      const y2 = toNode.y

      context.moveTo(x1, y1)
      context.lineTo(x1 + (x2 - x1) / 2, y1)
      context.lineTo(x1 + (x2 - x1) / 2, y2)
      context.lineTo(x2, y2)
    }

    if (orient === 'left') {
      const x1 = node.x - (node.width / 2) - space
      const y1 = node.y
      const x2 = toNode.x + (toNode.width / 2) + space
      const y2 = toNode.y

      context.moveTo(x1, y1)
      context.lineTo(x1 + (x2 - x1) / 2, y1)
      context.lineTo(x1 + (x2 - x1) / 2, y2)
      context.lineTo(x2, y2)
    }


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

    // console.log("arrowX, arrowY", arrowX, arrowY);

    //画上边箭头线
    context.moveTo(arrowX, arrowY)
    context.lineTo(toX, toY)

    arrowX = toX + botX
    arrowY = toY + botY

    // console.log("arrowX, arrowY", arrowX, arrowY);

    //画下边箭头线
    context.lineTo(arrowX, arrowY)
  }
}

export default new Liner()
