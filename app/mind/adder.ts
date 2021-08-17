import '../styles/style.scss'

export default class Adder {
  constructor(element: HTMLDivElement, modal: HTMLDivElement) {
    this.node = element
    this.modal = modal
  }

  static init(container: HTMLDivElement) {

    //创建 Adder Box
    const box = document.createElement('div')
    box.style.display = 'none'
    box.classList.add('node-adder')
    container.appendChild(box)

    box.innerHTML = `
      <span class="adder-handle handle-left"></span>
      <span class="adder-handle handle-right"></span>
      <span class="adder-handle handle-top"></span>
      <span class="adder-handle handle-right"></span>
    `

    const modal = document.createElement('div')
    modal.style.display = 'none'
    modal.classList.add('node-modal')

    container.appendChild(modal)

    return new Adder(box)
  }
}
