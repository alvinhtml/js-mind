import Stage from "./stage"
import Adder from "./adder"
import { Rect } from "./node/index"

export class Mind {

  stage2d: Stage

  //图形列表
  nodes: Array<any> = []

  //需要复原的动画
  recoverAnimateList = []

  data: any = {}

  adder: Adder

  constructor(element: HTMLDivElement | null) {
    if (element) {
      this.stage2d = new Stage(element)
      this.stage2d.translateX = (this.stage2d.width / 2) - 60
      this.stage2d.translateY = (this.stage2d.height / 2) - 20
    }
  }

  init(data: any) {
    this.data = data

    let items = [...data]

    let node

    while (items.length > 0) {
      const item = items.shift()

      console.log("item", item);

      switch (item.type) {
        case 'rect':

          break;

        default:
          node = new Rect()
          break;
      }

      this.nodes.push(node)

      // if (item.child && item.child.nodes.length > 0) {
      //   stack = stack.concat(item.children);
      // }
    }

    this.render()
  }

  render() {
    const scene = this.stage2d.getScene()
    scene.initContext()
    console.log("this.nodes", this.nodes);
    scene.paint(() => {

      this.nodes.forEach((node) => {
        node.paint(scene.context)
      })

    })
  }

  initAdder() {
    this.adder = new Adder(this.stage2d.container)
  }

  // 绑定事件
  addEventListener(event: string, callback: Function) {
    this.stage2d.addEventListener(event, callback)
  }
}
