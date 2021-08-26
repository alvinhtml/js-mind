import Stage from "./stage"
import Adder from "./adder"
import { Rect, Circle, Diamond } from "./node/index"

type Node = Rect | Circle | Diamond

interface Link {
  orient: string
  node: Node
}

interface Space {
  width: number
  height: number
}

export class Mind {

  id: string = 'mind'

  stage2d: Stage

  //图形列表
  nodes: Array<any> = []

  //需要复原的动画
  recoverAnimateList = []

  data: any | null = []

  nodeTree: any[] = []

  adder: Adder

  selected: Node | null

  space: Space = {
    width: 100,
    height: 100
  }

  rect: Space = {
    width: 100,
    height: 100
  }

  constructor(element: HTMLDivElement | null) {
    if (element) {
      this.id = element.id || 'mind'
      this.stage2d = new Stage(element)
      this.initTool(element)

      const data = localStorage.getItem(`${this.id}-data`)
      this.data = data ? JSON.parse(data) : null
    }
  }

  init(data: any[]) {
    this.initAdder()

    if (!Array.isArray(this.data)) {
      this.data = data
      localStorage.setItem(`${this.id}-data`, JSON.stringify(data))
    }
    this.initNode(this.data)
    this.initPosition(true)

    this.stage2d.addEventListener('click', (e: any) => {
      if (e.target) {
        this.selected = e.target
        e.target.actived = true
        this.adder.show(e.target.x + this.stage2d.translateX, e.target.y + this.stage2d.translateY, e.target.width, e.target.height)
      } else {
        this.selected = null
        this.adder.hide()
      }
    })

    this.render()
  }

  initTool(element: HTMLDivElement) {
    // 创建工具条
    const tools = document.createElement('div')
    tools.classList.add('js-mind-tools')
    element.appendChild(tools)

    // 清空节点
    const clearNode = document.createElement('div')
    clearNode.classList.add('js-mind-tool-button')
    clearNode.title = '清空节点'
    clearNode.innerHTML = `
      <svg t="1629865129898" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8065" width="22" height="22">
        <path d="M340.88 839.624L155.76 659.722l129.921-133.803L571.05 819.852l-19.196 19.772H340.88z m552.795-352.045L621.453 767.947l-285.4-293.932 272.232-280.368 285.39 293.932z m100.796 0L608.285 89.838 53.45 661.263l259.305 251.969h555.424v-73.608H652.65l341.821-352.045z" fill="#707070" p-id="8066" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path>
      </svg>
    `

    clearNode.onclick = () => {
      const isClear = window.confirm('你确定要清除所有节点吗？')

      if (isClear) {

      } else {

      }
    }

    tools.appendChild(clearNode)

    // 保存图片
    const saveImage = document.createElement('div')
    clearNode.title = '保存 Json Data'
    saveImage.classList.add('js-mind-tool-button')
    saveImage.innerHTML = `
      <svg t="1629866123722" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8949" width="22" height="22">
        <path d="M62.848 60.992h704v64h-704zM62.848 640.832h543.936v64H62.848z" p-id="8950" fill="#707070"></path>
        <path d="M702.848 60.992h64v320h-64zM62.848 113.536h64v527.296h-64z" p-id="8951" fill="#707070"></path>
        <path d="M70.528 498.304l218.24-117.312 30.4 56.32-218.304 117.376z" p-id="8952" fill="#707070"></path>
        <path d="M298.432 375.04l144.896 274.176-56.576 29.888L241.92 404.928zM512 194.176h126.592v127.168H512zM663.296 448.448h128v320h-128z" p-id="8953" fill="#707070"></path>
        <path d="M599.36 764.992l127.936 128 128.064-128z" p-id="8954" fill="#707070"></path>
      </svg>
    `
    // 点击下载图片
    saveImage.onclick = () => {
      if (this.stage2d.scenes[0].canvas) {
        const canvas = document.createElement('canvas')
        canvas.width = this.rect.width + 200
        canvas.height = this.rect.height + 200
        const context = canvas.getContext('2d')
        if (context) {
          context.strokeStyle = '#ffffff'
      		context.lineJoin = 'bevel'
          context.lineCap = 'round'
      		context.miterLimit = 1
      		context.textAlign = 'center'
      		context.textBaseline = 'middle'
      		context.fillStyle = '#ffffff'

          // 求出最左节点的 x
          const tx = this.nodes.reduce((a, b) => Math.min(a, b.x), 0)
          // 求出最上节点的 y
          const ty = this.nodes.reduce((a, b) => Math.min(a, b.y), 0)

          // 偏移画布，并留出 100 的空白
          context.translate(-tx + 100, -ty + 100)
          this.paint(context)

          const dataURL = canvas.toDataURL('image/png')

          // 创建 a 本标签
          const a = document.createElement('a')
          a.setAttribute('href', dataURL)
          a.setAttribute('download', `${this.id}.png`)
          a.setAttribute('target', '_blank')

          // 触发点击事件
          const clickEvent = document.createEvent('MouseEvents')
          clickEvent.initEvent('click', true, true)
          a.dispatchEvent(clickEvent)
        }
      }
    }

    tools.appendChild(saveImage)

    // 保存JSON
    const saveJson = document.createElement('div')
    saveJson.classList.add('js-mind-tool-button')
    saveJson.innerHTML = `
      <svg t="1629869742720" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14016" width="22" height="22"><path d="M742.4 755.456H564.770133c-14.4384 0-26.112 12.475733-26.112 27.869867v168.618666h28.433067L742.4 760.439467v-4.983467zM742.4 699.733333v-88.183466c0-15.189333 11.4688-27.477333 25.6-27.477334s25.6 12.288 25.6 27.477334v160.136533c0 7.2192-2.645333 14.1312-7.338667 19.285333L596.087467 998.7072a24.746667 24.746667 0 0 1-18.261334 8.226133H194.56C129.536 1006.933333 76.8 950.306133 76.8 880.452267V143.530667C76.8 73.693867 129.536 17.066667 194.56 17.066667h481.28C740.864 17.066667 793.6 73.693867 793.6 143.547733v48.930134c0 15.189333-11.4688 27.477333-25.6 27.477333s-25.6-12.288-25.6-27.477333V143.530667c0-39.4752-29.7984-71.492267-66.56-71.492267H194.56c-36.7616 0-66.56 32.017067-66.56 71.509333v736.887467c0 39.4752 29.7984 71.492267 66.56 71.492267H486.4v-168.618667C486.4 737.160533 521.489067 699.733333 564.770133 699.733333H742.4zM289.058133 294.570667h33.3824l-15.581866 153.275733c-2.645333 26.026667-9.437867 45.056-20.4288 57.7536-12.1856 13.329067-29.986133 20.002133-53.674667 20.002133-20.548267 0-35.601067-6.3488-44.868267-19.0464-9.557333-12.6976-13.192533-30.139733-10.939733-52.360533l0.733867-7.304533h33.399466l-0.7168 6.997333c-2.645333 26.0096 6.024533 39.0144 26.282667 39.0144 11.127467 0 19.797333-3.805867 25.668267-11.093333 5.888-7.304533 9.642667-19.0464 11.281066-35.2256l15.4624-152.0128z m144.128-4.437334c23.978667 0 42.257067 5.393067 54.545067 16.503467 13.073067 11.741867 19.473067 30.139733 18.944 54.903467H473.6c-1.4336-13.9776-5.819733-24.132267-12.629333-30.1568-6.775467-6.3488-17.902933-9.198933-32.733867-9.198934-12.8512 0-22.7328 1.911467-30.0032 6.024534-9.045333 4.778667-13.858133 12.6976-14.9504 23.483733-0.9728 9.5232 2.798933 17.4592 11.912533 23.176533 4.027733 2.525867 15.240533 7.287467 33.399467 13.960534 26.709333 9.506133 43.6224 17.134933 51.0976 22.203733 16.503467 11.741867 23.7056 27.938133 21.572267 48.878933-2.048 20.309333-10.837333 36.488533-26.299734 48.2304-15.428267 11.434667-36.3008 17.4592-62.276266 17.4592-25.105067 0-44.253867-5.393067-57.1392-16.196266-15.7696-13.312-23.04-34.269867-21.538134-63.146667h33.109334c0.512 17.134933 4.693333 29.525333 12.8 36.8128 7.338667 6.3488 19.2512 9.8304 36.096 9.8304 14.848 0 27.101867-2.850133 36.215466-8.2432 9.147733-5.717333 14.455467-13.0048 15.428267-22.528 1.211733-12.066133-4.369067-21.589333-16.213333-28.5696-3.771733-2.218667-16.384-7.287467-38.161067-14.916267-24.200533-8.874667-39.253333-15.223467-44.868267-19.029333-14.626133-10.478933-20.7872-25.7024-18.7392-45.704533 2.030933-19.985067 11.0592-35.84 27.630934-47.274667 15.394133-11.093333 33.928533-16.503467 55.893333-16.503467z m207.223467 0c31.112533 0 54.528 11.093333 70.212267 33.621334 14.9504 21.282133 20.650667 49.527467 17.1008 84.4288-3.549867 34.901333-14.9504 62.8224-34.235734 84.087466-20.241067 22.2208-45.909333 33.3312-77.0048 33.3312-31.402667 0-54.784-11.434667-70.212266-33.6384-14.933333-21.589333-20.360533-49.5104-16.878934-83.797333 3.515733-34.577067 14.626133-62.498133 33.962667-84.0704C583.338667 301.226667 609.006933 290.133333 640.392533 290.133333z m-3.242667 32.682667c-21.128533 0-38.1952 7.936-51.5072 23.808-12.680533 15.223467-20.1728 35.5328-22.818133 61.559467-2.6112 25.7024 0.750933 46.011733 10.325333 61.252266 9.847467 15.530667 25.582933 23.466667 46.6944 23.466667 21.128533 0 38.161067-7.611733 51.0976-22.528 12.629333-14.916267 20.445867-35.5328 23.159467-62.190933 2.7136-26.658133-0.8704-47.616-10.4448-62.839467-9.864533-15.223467-25.3952-22.528-46.506667-22.528z m131.84-28.245333h33.3824l84.1216 163.4304h1.143467l16.605867-163.4304h33.672533l-23.04 226.577066h-32.529067L797.354667 355.498667h-1.143467l-16.8448 165.649066H745.984l23.04-226.577066z" p-id="14017" fill="#707070"></path></svg>
    `

    saveJson.onclick = () => {
      const json = this.toJsonString()
      const dialog = document.createElement('div')
      dialog.classList.add('js-mind-dialog')
      dialog.innerHTML = `
        <div class="mind-dialog-header">
          <h3>Json Data</h3>
          <div class="mind-dialog-close">×</div>
        </div>
        <div class="mind-dialog-body"><pre>${json}</pre></div>
      `
      document.body.appendChild(dialog)
      const closeElement = dialog.querySelector('.mind-dialog-close')
      if (closeElement) {
        (closeElement as HTMLDivElement).onclick = () => {
          document.body.removeChild(dialog)
        }
      }
    }

    tools.appendChild(saveJson)
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
    this.nodes = []

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
        node.datahandle = item

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

  initPosition(animate: boolean) {
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

    this.rect = boundingClientRect(this.nodeTree, true)

    if (this.stage2d.translateX === 0 && this.stage2d.translateY === 0) {
      this.stage2d.initTranslate(this.rect.width, this.rect.height)
    }

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

      let nodeX = 0
      let nodeY = 0

      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        if (isHorizontal) {
          nodeX = x + (item.spaceWidth / 2)
          nodeY = y
        } else {
          nodeX = x
          nodeY = y + (item.spaceHeight / 2)
        }

        if (item.children) {
          const topSpaceWidth = item.children.top.reduce((a: number, b: any) => a + b.spaceWidth , 0)
          const bottomSpaceWidth = item.children.bottom.reduce((a: number, b: any) => a + b.spaceWidth , 0)
          const leftSpaceWidth = item.children.left.reduce((a: number, b: any) => Math.max(a, b.spaceWidth), 0)
          // const rightSpaceWidth = item.children.right.reduce((a: number, b: any) => Math.max(a, b.spaceWidth), 0)
          const leftSpaceHeight = item.children.left.reduce((a: number, b: any) => a + b.spaceHeight , 0)
          const rightSpaceHeight = item.children.right.reduce((a: number, b: any) => a + b.spaceHeight , 0)

          if (leftSpaceWidth > 0 && isHorizontal) {
            nodeX = x + leftSpaceWidth + (spaceWidth / 2)
          }

          setPosition(item.children.top, nodeX - (topSpaceWidth / 2), nodeY - spaceHeight, true)
          setPosition(item.children.right, nodeX + spaceWidth, nodeY - (rightSpaceHeight / 2), false)
          setPosition(item.children.bottom, nodeX - (bottomSpaceWidth / 2), nodeY + spaceHeight, true)
          setPosition(item.children.left, nodeX - spaceWidth, nodeY - (leftSpaceHeight / 2), false)
        }

        if (animate) {
          item.node.animate({
            x: nodeX,
            y: nodeY
          })
        } else {
          item.node.x = nodeX
          item.node.y = nodeY
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

  // 添加一个新的节点
  addNode(node: Node, orient: string, data: any) {
    if (!node.datahandle.children) {
      node.datahandle.children = {}
    }

    if (!node.datahandle.children[orient]) {
      node.datahandle.children[orient] = []
    }

    node.datahandle.children[orient].push(data)

    this.initNode(this.updateData())
    this.initPosition(false)
    localStorage.setItem(`${this.id}-data`, JSON.stringify(this.data))
  }

  editNode(node: Node, title: string) {
    node.datahandle.title = title
    this.initNode(this.updateData())
    this.initPosition(false)
    localStorage.setItem(`${this.id}-data`, JSON.stringify(this.data))
  }

  deleteNode(node: Node) {
    node.datahandle.deleted = true
    this.initNode(this.updateData())
    this.initPosition(false)
    localStorage.setItem(`${this.id}-data`, JSON.stringify(this.data))
  }

  render() {
    const scene = this.stage2d.getScene()
    scene.initContext()

    scene.paint(() => {
      this.paint(scene.context)
    })
  }

  paint(context: CanvasRenderingContext2D) {
    // 画节点之间的联线
    context.beginPath()
    context.moveTo(0 , 0)
    this.nodes.forEach((node) => {
      if (node.links.length > 0) {
        node.links.forEach((link: Link) => {
          this.paintLine(context, link.orient, link.node, node)
        })
      }
    })
    context.moveTo(0 , 0)
    context.closePath()
    context.strokeStyle = '#999'
    context.lineWidth = 1

    context.stroke()

    context.lineWidth = 1

    // 画节点
    this.nodes.forEach((node) => {
      node.paint(context)
    })

    context.fillStyle = '#333'

    // 名称文字
    this.nodes.forEach((node) => {
      node.paintTitle(context)
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

    // 添加节点回调
    this.adder.onAdd((orient: any) => {
      if (this.selected) {
        this.addNode(this.selected, orient, {
          title: 'new node'
        })
      }
    })

    // 编辑节点回调
    this.adder.onEdit((input: HTMLInputElement) => {
      if (this.selected) {
        input.value = this.selected.name
        input.onblur = () => {
          if (this.selected) {
            this.editNode(this.selected, input.value)
          }
        }
      }
    })

    // 删除节点
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.keyCode === 46 || e.keyCode === 8) {
        if (this.selected) {
          this.deleteNode(this.selected)
          this.adder.hide()
        }
      }
    })
  }

  toJsonString() {
    return JSON.stringify(this.data, null, 2)
  }

  updateData(): any[] {
    const update = (data: any[]): any[] => {
      const arr = data.filter(item => !item.deleted).map((item) => {
        if (item.children) {
          if (item.children.top) {
            item.children.top = update(item.children.top)
          }
          if (item.children.right) {
            item.children.right = update(item.children.right)
          }
          if (item.children.bottom) {
            item.children.bottom = update(item.children.bottom)
          }
          if (item.children.left) {
            item.children.left = update(item.children.left)
          }
        }
        return item
      })

      return arr
    }

    this.data = update(this.data)
    return this.data
  }


  // 绑定事件
  addEventListener(event: string, callback: Function) {
    this.stage2d.addEventListener(event, callback)
  }
}
