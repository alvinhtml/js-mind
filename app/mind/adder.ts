export default class Adder {

  node: HTMLDivElement

  editer: HTMLDivElement

  callback: Function
  editCallback: Function

  constructor(element: HTMLDivElement, editer: HTMLDivElement) {
    this.node = element
    this.editer = editer

    const orientArray = ['left', 'top', 'right', 'bottom']

    // 添加四个方向的 handle
    orientArray.forEach((item: string) => {
      const handle = document.createElement('div')
      handle.setAttribute('data-title', '点击添加子节点')
      handle.classList.add('adder-handle', `handle-${item}`)

      handle.onclick = () => {
        this.callback(item)
      }

      element.appendChild(handle)
    })


    const input = document.createElement('input')
    editer.appendChild(input)

    input.onkeydown = (e: KeyboardEvent) => {
      e.stopPropagation()
    }

    input.onmousedown = (e: MouseEvent) => {
      e.stopPropagation()
    }

    this.node.ondblclick = () => {
      this.editer.style.display = 'flex'
      input.focus()
      this.editCallback(input)
    }
  }

  show(x: number, y: number, width: number, height: number) {
    this.node.style.left = x - (width / 2) + 'px'
    this.node.style.top = y - (height / 2) + 'px'
    this.node.style.width = width + 'px'
    this.node.style.height = height + 'px'
    this.node.style.display = 'block'

    this.editer.style.left = x - (width / 2) + 3 + 'px'
    this.editer.style.top = y - (height / 2) + 3 + 'px'
    this.editer.style.width = width - 6 + 'px'
    this.editer.style.height = height - 6 + 'px'
  }

  hide() {
    this.node.style.display = 'none'
    this.editer.style.display = 'none'
  }

  onAdd(callback: Function) {
    this.callback = callback
  }

  onEdit(callback: Function) {
    this.editCallback = callback
  }

  static init(container: HTMLDivElement) {

    //创建 Adder Box
    const box = document.createElement('div')
    box.style.display = 'none'
    box.classList.add('node-adder')
    container.appendChild(box)

    const editer = document.createElement('div')
    editer.style.display = 'none'
    editer.classList.add('node-editer')

    container.appendChild(editer)

    return new Adder(box, editer)
  }
}
