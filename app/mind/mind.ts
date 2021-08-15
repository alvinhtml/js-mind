import Stage from "./stage"

export class Mind {

  stage2d: Stage

  //图形列表
  nodes: Array<any> = []

  //需要复原的动画
  recoverAnimateList = []

  tip = null

  constructor(element: HTMLDivElement | null) {
    if (element) {
      this.stage2d = new Stage(element);
    }
  }

  render() {
    this.nodes.forEach((chart) => {
      chart.paint()
    })
  }

  // 绑定事件
  addEventListener(event: string, callback: Function) {
    this.stage2d.addEventListener(event, callback)
  }
}
