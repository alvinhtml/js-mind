import { Text, Rect, Circle, Diamond } from "./node/index"

type Position = 'top' | 'right' | 'bottom' | 'left'

interface Line {
  node: Node
  startPosition: Position
  toNode: Node
  endPosition: Position
  type: string
}

class Liner {
  list: Array<Line>

  addLine(node: Node, startPosition: Position, toNode: Node, endPosition: Position, type: string) {
    this.list.push({
      node,
      startPosition,
      toNode,
      endPosition,
      type
    })
  }
}

export default new Liner()
