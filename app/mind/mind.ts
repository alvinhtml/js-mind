import Stage from "./stage"
import Adder from "./adder"
import { Rect, Circle, Diamond } from "./node/index"

type Node = Rect

interface Link {
  orient: string
  node: Node
}

interface Space {
  width: number
  height: number
}

export class Mind {

  stage2d: Stage

  //图形列表
  nodes: Array<any> = []

  //需要复原的动画
  recoverAnimateList = []

  data: any = []

  nodeTree: any[] = []

  adder: Adder

  selected: Node

  constructor(element: HTMLDivElement | null) {
    if (element) {
      this.stage2d = new Stage(element)
    }
  }

  init(data: any[]) {
    this.initAdder()
    this.initNode(data)

    this.initPosition()
    //


    this.stage2d.addEventListener('click', (e: any) => {
      console.log("e", e);
      if (e.target) {
        this.selected = e.target
        e.target.actived = true
        this.adder.show(e.target.x + this.stage2d.translateX, e.target.y + this.stage2d.translateY, e.target.width, e.target.height)
      } else {
        this.adder.hide()
      }
    })

    this.render()
  }

  createNode(type: string): Node {
    switch (type) {
      case 'rect':
        return new Rect()
      case 'circle':
        return new Circle()
      case 'diamond':
        return new Diamond()
      default:
        return new Rect()
    }
  }

  initNode(data: any[]) {
    // 解析 json data, 并创建对应的节点
    const parse = (data: any[], parent: null | Node, orient: string): any[] => {

      if (!data || data.length <= 0) {
        return []
      }

      const nodes = []


      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        const node = this.createNode(item.type)
        node.stage2d = this.stage2d
        node.name = item.title
        if (item.color) {
          node.initColor(item.color)
        }
        this.nodes.push(node)

        if (parent) {
          node.links.push({
            orient,
            node: parent
          })
        }

        let top
        let right
        let bottom
        let left

        if (item.children) {
          top = parse(item.children.top, node, 'top')
          right = parse(item.children.right, node, 'right')
          bottom = parse(item.children.bottom, node, 'bottom')
          left = parse(item.children.left, node, 'left')
        }

        const nodeObject = {
          node,
          spaceWidth: 0,
          spaceHeight: 0
        }

        if (left || right || top || bottom) {
          Object.defineProperty(nodeObject, 'children', {
            enumerable: true,
            writable: true,
            configurable: true,
            value: {
              top,
              right,
              bottom,
              left
            }
          })
        }

        nodes.push(nodeObject)
      }
      return nodes
    }

    this.nodeTree = parse(data, null, '')
  }

  initPosition() {
    const spaceWidth = 100
    const spaceHeight = 100

    /**
     * 计算每个节点和其子节点所占空间大小
     *
     * @param {any[]}   data children data.
     * @param {boolean} isHorizontal children orient.
     * @internal
     */
    const boundingClientRect = (data: any[], isHorizontal: boolean): Space => {

      let width = 0
      let height = 0

      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        item.spaceWidth = spaceWidth
        item.spaceHeight = spaceHeight

        if (item.children) {
          const top = boundingClientRect(item.children.top, true)
          const right = boundingClientRect(item.children.right, false)
          const bottom = boundingClientRect(item.children.bottom, true)
          const left = boundingClientRect(item.children.left, false)

          // console.log(item.node.name, left, top, bottom, right);

          item.spaceWidth += Math.max(left.width + right.width, top.width - spaceWidth, bottom.width - spaceWidth)
          item.spaceHeight += Math.max(top.height + bottom.height, left.height - spaceHeight, right.height - spaceHeight)
        }

        // console.log(item.node.name, item, isHorizontal);

        if (isHorizontal) {
          console.log(item.node.name, width, height, data);
          width += item.spaceWidth
          height = Math.max(item.spaceHeight, height)
        } else {
          width = Math.max(item.spaceWidth, width)
          height += item.spaceHeight
        }


      }
      return {
        width,
        height
      }
    }

    const rect = boundingClientRect(this.nodeTree, true)

    if (this.stage2d.translateX === 0 && this.stage2d.translateY === 0) {
      this.stage2d.initTranslate(rect.width, rect.height)
    }

    console.log("rect", rect);

    /**
     * 根据坐标和子节点，计算当前节点的位置信息
     *
     * @param {Object[]}  data children data.
     * @param {number}    spaceX X 坐标.
     * @param {number}    spaceY Y 坐标.
     * @param {boolean}   isHorizontal children orient.
     * @internal
     */
    const setPosition = (data: any[], spaceX: number, spaceY: number, isHorizontal: boolean) => {
      let x = spaceX
      let y = spaceY

      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        if (isHorizontal) {
          item.node.x = x + (item.spaceWidth / 2)
          item.node.y = y
        } else {
          item.node.x = x
          item.node.y = y + (item.spaceHeight / 2)
        }

        if (item.children) {
          const topSpaceWidth = item.children.top.reduce((a: number, b: any) => a + b.spaceWidth , 0)
          const bottomSpaceWidth = item.children.bottom.reduce((a: number, b: any) => a + b.spaceWidth , 0)
          const leftSpaceWidth = item.children.left.reduce((a: number, b: any) => Math.max(a, b.spaceWidth), 0)
          // const rightSpaceWidth = item.children.right.reduce((a: number, b: any) => Math.max(a, b.spaceWidth), 0)
          const leftSpaceHeight = item.children.left.reduce((a: number, b: any) => a + b.spaceHeight , 0)
          const rightSpaceHeight = item.children.right.reduce((a: number, b: any) => a + b.spaceHeight , 0)

          if (leftSpaceWidth > 0 && isHorizontal) {
            item.node.x = x + leftSpaceWidth + (spaceWidth / 2)
          }

          setPosition(item.children.top, item.node.x - (topSpaceWidth / 2), item.node.y - spaceHeight, true)
          setPosition(item.children.right, item.node.x + spaceWidth, item.node.y - (rightSpaceHeight / 2), false)
          setPosition(item.children.bottom, item.node.x - (bottomSpaceWidth / 2), item.node.y + spaceHeight, true)
          setPosition(item.children.left, item.node.x - spaceWidth, item.node.y - (leftSpaceHeight / 2), false)
        }

        if (isHorizontal) {
          x += item.spaceWidth
        } else {
          y += item.spaceHeight
        }
      }
    }

    setPosition(this.nodeTree, 0, 0, true)

  }

  render() {
    const scene = this.stage2d.getScene()
    scene.initContext()

    scene.paint(() => {

      // 画节点之间的联线
      scene.context.beginPath()
      scene.context.moveTo(0 , 0)
      this.nodes.forEach((node) => {
        if (node.links.length > 0) {
          node.links.forEach((link: Link) => {
            this.paintLine(scene.context, link.orient, link.node, node)
          })
        }
      })
      scene.context.moveTo(0 , 0)
      scene.context.closePath()
      scene.context.strokeStyle = '#999'
      scene.context.lineWidth = 1

      scene.context.stroke()

      scene.context.lineWidth = 1

      // 画节点
      this.nodes.forEach((node) => {
        node.paint(scene.context)
      })

      scene.context.fillStyle = '#333'

      // 名称文字
      this.nodes.forEach((node) => {
        node.paintTitle(scene.context)
      })
    })
  }

  paintLine(context: CanvasRenderingContext2D, orient: string, node: Node, toNode: Node) {
    const space = 2

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

  initAdder() {
    this.adder = Adder.init(this.stage2d.container)
    this.adder.addNode((orient: any) => {
      console.log("this.selected", this.selected);
    })
  }

  // 绑定事件
  addEventListener(event: string, callback: Function) {
    this.stage2d.addEventListener(event, callback)
  }
}
