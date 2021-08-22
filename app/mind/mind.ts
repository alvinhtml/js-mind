import Stage from "./stage"
import Adder from "./adder"
import { Rect } from "./node/index"

type Node = Rect

interface Link {
  orient: string
  node: Node
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
      default:
        return new Rect()
    }
  }

  initNode(data: any[]) {
    // 解析 json data, 并创建对应的节点
    const parse = (data: any[], parent: null | Node, orient: string): any[] => {
      console.log("data", data);

      if (!data || data.length <= 0) {
        return []
      }

      const nodes = []


      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        const node = this.createNode(item.type)
        node.stage2d = this.stage2d
        node.name = item.title
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
    const spaceX = 150
    const spaceY = 120

    // let items = [...this.nodeTree]

    const boundingClientRect = (data: any[], isGrowthX: boolean) => {

      let width = 0
      let height = 0

      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        if (item.children) {
          const top = boundingClientRect(item.children.top, true)
          const right = boundingClientRect(item.children.right, false)
          const bottom = boundingClientRect(item.children.bottom, true)
          const left = boundingClientRect(item.children.left, false)


          item.spaceWidth = Math.max(left.width + right.width, top.width, bottom.width)
          item.spaceHeight = Math.max(top.height + bottom.height, left.height, right.height)
        } else {
          item.spaceWidth = spaceX
          item.spaceHeight = spaceY
        }

        console.log("item", item);

        if (isGrowthX) {
          width += item.spaceWidth
          height = item.spaceHeight + spaceY
        } else {
          width = item.spaceWidth + spaceX
          height += item.spaceHeight
        }
      }

      return {
        width,
        height
      }
    }

    boundingClientRect(this.nodeTree, true)

    // console.log("this.nodeTree == ", this.nodeTree);


    const setPosition = (data: any[], x: number, y: number, isHorizontal: boolean) => {
      let ox = x
      let oy = y

      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        if (isHorizontal) {
          item.node.x = ox + (item.spaceWidth / 2) - (item.node.width / 2)
          item.node.y = oy
          ox += item.spaceWidth
        } else {
          item.node.x = ox
          item.node.y = oy + (item.spaceHeight / 2) - (item.node.height / 2)
          oy += item.spaceHeight
        }

        if (item.children) {
          setPosition(item.children.top, item.node.x, item.node.y - spaceY, true)
          setPosition(item.children.right, item.node.x + spaceX, item.node.y + (item.node.height / 2) - (item.spaceHeight / 2), false)
          setPosition(item.children.bottom, item.node.x + (item.node.width / 2) - (item.spaceWidth / 2), item.node.y + spaceY, true)
          setPosition(item.children.left, item.node.x - spaceX, item.node.y, false)
        }
      }
    }

    setPosition(this.nodeTree, 0, 0, true)


    // while (items.length > 0) {
    //   const item = items.shift()
    //
    //   item.node.x = 0
    //   item.node.y = 0
    //
    //
    //   if (item.children) {
    //     item.children.forEach((child: any) => {
    //       if (child.nodes) {
    //         items = items.concat(child.nodes)
    //       }
    //     })
    //   }
    // }
  }

  // initNode(context: CanvasRenderingContext2D) {
  //   this.nodes.forEach((node) => {
  //     node.width = 120
  //     node.height = 40
  //   })
  // }


  render() {
    const scene = this.stage2d.getScene()
    scene.initContext()
    console.log("this.nodes", this.nodes);




    scene.paint(() => {

      this.nodes.forEach((node) => {
        node.paint(scene.context)
      })

      scene.context.fillStyle = '#333'

      this.nodes.forEach((node) => {
        node.paintTitle(scene.context)
      })

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
      scene.context.lineWidth = 2

      scene.context.stroke()
    })
  }

  paintLine(context: CanvasRenderingContext2D, orient: string, node: Node, toNode: Node) {
    const space = 5

    if (orient === 'bottom') {
      const x1 = node.x + (node.width / 2)
      const y1 = node.y + node.height + space
      const x2 = toNode.x + (node.width / 2)
      const y2 = toNode.y - space

      context.moveTo(x1, y1)
      context.bezierCurveTo(x1, y1 + (y2 - y1) / 2, x2, y2 - (y2 - y1) / 2, x2, y2)
    }

    if (orient === 'right') {
      const x1 = node.x + node.width + space
      const y1 = node.y + (node.height / 2)
      const x2 = toNode.x - 5
      const y2 = toNode.y + (toNode.height / 2)

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
