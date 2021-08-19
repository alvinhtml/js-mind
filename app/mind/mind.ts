import Stage from "./stage"
import Adder from "./adder"
import { Rect } from "./node/index"

export class Mind {

  stage2d: Stage

  //图形列表
  nodes: Array<any> = []

  //需要复原的动画
  recoverAnimateList = []

  data: any = []

  nodeTree: any[] = []

  adder: Adder

  selected: Rect

  constructor(element: HTMLDivElement | null) {
    if (element) {
      this.stage2d = new Stage(element)
      this.stage2d.translateX = (this.stage2d.width / 2) - 60
      this.stage2d.translateY = (this.stage2d.height / 2) - 20
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

  createNode(type: string): Rect {
    switch (type) {
      case 'rect':
        return new Rect()
      default:
        return new Rect()
    }
  }

  initNode(data: any[]) {
    // 解析 json data, 并创建对应的节点
    const parse = (data: any[], layer: number): any[] => {
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

        let top
        let right
        let bottom
        let left

        if (item.children) {
          top = parse(item.children.top, layer + 1)
          right = parse(item.children.right, layer + 1)
          bottom = parse(item.children.bottom, layer + 1)
          left = parse(item.children.left, layer + 1)
        }

        const nodeObject = {
          layer,
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

    this.nodeTree = parse(data, 0)
  }

  initPosition() {
    const spaceX = 150
    const spaceY = 80

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
          item.node.x = ox
          item.node.y = oy
          ox += item.spaceWidth
        } else {
          item.node.x = ox
          item.node.y = oy
          oy += item.spaceHeight
        }

        if (item.children) {
          setPosition(item.children.top, item.node.x, item.node.y - spaceY, true)
          setPosition(item.children.right, item.node.x + spaceX, item.node.y, false)
          setPosition(item.children.bottom, item.node.x, item.node.y + spaceY, true)
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
    })
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
