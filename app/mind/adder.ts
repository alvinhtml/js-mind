export default class Adder {

  node: HTMLDivElement

  modal: HTMLDivElement

  callback: Function

  constructor(element: HTMLDivElement, modal: HTMLDivElement) {
    this.node = element
    this.modal = modal

    const orientArray = ['left', 'top', 'right', 'bottom']

    // 添加四个方向的 handle
    orientArray.forEach((item: string) => {
      const handle = document.createElement('div')
      handle.classList.add('adder-handle', `handle-${item}`)

      handle.onclick = () => {
        this.callback(item)
      }

      element.appendChild(handle)
    })
  }

  show(x: number, y: number, width: number, height: number) {
    this.node.style.left = x - (width / 2) + 'px'
    this.node.style.top = y - (height / 2) + 'px'
    this.node.style.width = width + 'px'
    this.node.style.height = height + 'px'
    this.node.style.display = 'block'
  }

  hide() {
    this.node.style.display = 'none'
  }

  addNode(callback: Function) {
    this.callback = callback
  }

  static init(container: HTMLDivElement) {

    //创建 Adder Box
    const box = document.createElement('div')
    box.style.display = 'none'
    box.classList.add('node-adder')
    container.appendChild(box)

    const modal = document.createElement('div')
    modal.style.display = 'none'
    modal.classList.add('node-modal')

    container.appendChild(modal)

    return new Adder(box, modal)
  }
}
