import Stage from "./stage"
import Adder from "./adder"
import Toolbar, { ToolEvent } from "./toolbar"
import { Text, Rect, Circle, Diamond } from "./node/index"

type Node = Rect | Circle | Diamond | Text

interface Link {
  orient: string
  node: Node
}

interface Space {
  width: number
  height: number
}

interface Item {
  title: string
  type?: string
  color?: string
  width?: number
  height?: number
  children?: {
    left?: Array<Item>
    top?: Array<Item>
    right?: Array<Item>
    bottom?: Array<Item>
  }
}

interface TreeItem {
  node: Node
  spaceHeight: number
  spaceWidth: number
  children?: {
    left: Array<TreeItem>
    top: Array<TreeItem>
    right: Array<TreeItem>
    bottom: Array<TreeItem>
  }
}

interface Option {
  type: 'tree' | 'mind'
  orient: 'horizontal' | 'vertical'
  spaceWidth: number
  spaceHeight: number
  lineSpace: number
  nodeWidth: number
  nodeHeight: number
}

export class Mind {

  id: string = 'mind'

  stage2d: Stage

  //图形列表
  nodes: Array<any> = []

  //需要复原的动画
  recoverAnimateList = []

  data: any | null = []

  nodeTree: TreeItem[] = []

  adder: Adder
  toolbar: Toolbar

  // 当前选中的节点
  selected: Node | null

  // 当前拖动的节点
  dragged: Node | null

  rect: Space = {
    width: 100,
    height: 100
  }

  option: Option

  constructor(element: HTMLDivElement | null) {
    if (element) {
      this.id = element.id || 'mind'
      this.stage2d = new Stage(element)
    }
  }

  // 转化为 mind 格式的 data
  parseData(data: any[], orient: string): Item[] {
    const todata = (data: any[], orient: string): Item[] => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item.children) {
          if (Array.isArray(item.children)) {
            item.children = {
              [orient]: todata(item.children, orient)
            }
          } else {
            if (item.children.top) {
              item.children.top = todata(item.children.top, 'top')
            }
            if (item.children.right) {
              item.children.right = todata(item.children.right, 'right')
            }
            if (item.children.bottom) {
              item.children.bottom = todata(item.children.bottom, 'bottom')
            }
            if (item.children.left) {
              item.children.left = todata(item.children.left, 'left')
            }
          }
        }
      }
      return data
    }

    return todata(data, orient)
  }

  initOption(option: Partial<Option>) {
    this.option = {
      type: option.type || 'mind',
      orient: option.orient || 'horizontal',
      spaceWidth: option.spaceWidth || 150,
      spaceHeight: option.spaceHeight || 120,
      lineSpace: option.lineSpace || 3,
      nodeWidth: option.nodeWidth || 100,
      nodeHeight: option.nodeHeight || 38
    }

  }

  init(data: any[], option?: Partial<Option>) {
    this.initOption(option || {})
    this.initToolbar()
    this.initAdder()

    // 应用缓存
    const dataCache = localStorage.getItem(`${this.id}-data`)

    if (dataCache) {
      this.data = JSON.parse(dataCache)
    } else {
      this.data = this.parseData(data, this.option.orient === 'vertical' ? 'bottom' : 'left')
    }

    // 创建 node 节点
    this.initNode(this.data)

    // 添 cilck 事件，实现节点可点击选中
    this.stage2d.addEventListener('click', (e: any) => {
      if (e.target) {
        this.selected = e.target
        this.toolbar.enableDeleteNode()
        e.target.actived = true
        this.adder.show(
          e.target.x * this.stage2d.scale + this.stage2d.translateX,
          e.target.y * this.stage2d.scale + this.stage2d.translateY,
          e.target.width * this.stage2d.scale, e.target.height * this.stage2d.scale
        )
      } else {
        this.selected = null
        if (this.toolbar) {
          this.toolbar.disableDeleteNode()
        }
        this.adder.hide()
      }
    })

    let lastX = 0
    let lastY = 0

    // 添 mousedown 事件，实现按下开始拖动节点
    this.stage2d.addEventListener('mousedown', (e: any) => {
      if (e.target) {
        this.dragged = e.target
        this.stage2d.container.style.cursor = 'grab'
        lastX = e.mouseX
        lastY = e.mouseY
      }
    })

    this.stage2d.addEventListener('mouseup', (e: any) => {
      this.dragged = null
      this.stage2d.container.style.cursor = 'auto'
    })

    this.stage2d.addEventListener('mousemove', (e: any) => {
      if (this.dragged) {
        this.dragged.x = this.dragged.x + (e.mouseX - lastX) / this.stage2d.scale
        this.dragged.y = this.dragged.y + (e.mouseY - lastY) / this.stage2d.scale
      }
      lastX = e.mouseX
      lastY = e.mouseY
    })

    this.stage2d.addEventListener('mousewheel', (e: any) => {
      if (this.selected) {
        this.selected = null
        if (this.toolbar) {
          this.toolbar.disableDeleteNode()
        }
        this.adder.hide()
      }
    })

    this.render()
  }

  initToolbar() {
    const toolbar = Toolbar.init(this.stage2d.container, this.option)

    // 绑定点击事件
    toolbar.onClick((e: ToolEvent) => {
      switch (e.type) {
        // 清除缓存节点
        case 'clear':
          this.clearNode()
          break;

        // 放大
        case 'zoom-in':
          this.setZoom(false, toolbar)
          break;

        // 缩小
        case 'zoom-out':
          this.setZoom(true, toolbar)
          break;

        // 保存图片
        case 'save-to-image':
          this.saveImage()
          break;

        // 复制JSON
        case 'copy-json':
          this.saveJson()
          break;

        // 删除节点
        case 'delete':
          if (this.selected) {
            this.deleteNode(this.selected)
            this.adder.hide()
            this.toolbar.disableDeleteNode()
          }
          break;

        // 修改类型
        case 'circle':
        case 'rect':
        case 'diamond':
          this.changeNodeType(e.type)
          break;

        default:
          break;
      }
    })

    // 绑定拖动事件
    toolbar.onDrag((type: string) => {
      if (!this.dragged) {

        // 添加一个根节点
        this.data.push({
          title: 'new node',
          type
        })

        // 初始化节点数据
        this.resetAndCache()

        // 将新加入的这个节点，设置为当前正在拖动的节点
        this.dragged = this.nodeTree[this.nodeTree.length - 1].node
        this.stage2d.container.style.cursor = 'grab'

        if (this.dragged) {
          this.dragged.x = (this.stage2d.mouseX / this.stage2d.pixelRatio) - this.stage2d.translateX
          this.dragged.y = (this.stage2d.mouseY / this.stage2d.pixelRatio) - this.stage2d.translateY
        }
      }
    })

    // 绑定拖动结束事件
    toolbar.onDragend(() => {
      if (this.dragged) {
        // 拖动结束，释放节点
        this.dragged = null
        this.stage2d.container.style.cursor = 'auto'
      }
    })

    toolbar.setZoomText(Math.round(this.stage2d.scale * 100))

    // 修改颜色
    toolbar.onFill((color: string) => {
      if (this.selected) {
        this.setColor(this.selected, color)
      }
    })

    // 改变间距
    toolbar.onChange((option: {spaceWidth: number, spaceHeight: number}) => {
      this.option.spaceWidth = option.spaceWidth
      this.option.spaceHeight = option.spaceHeight

      this.resetAndCache()
    })




    this.toolbar = toolbar
  }

  createNode(type: string, item: Item, orient: string): Node {
    let node

    // 根据类型创建 Node
    switch (type) {
      case 'circle':
        node = new Circle()
        node.width = item.width ? item.width : this.option.nodeWidth * .8
        node.height = item.width ? item.width : this.option.nodeWidth * .8
        break
      case 'diamond':
        node = new Diamond()
        node.width = item.width ? item.width : this.option.nodeWidth * 1.2
        node.height = item.height ? item.height : this.option.nodeHeight * 1.2
        break
      case 'text':
        node = new Text()
        if (item.children) {
          node.textAlign = 'center'
        } else {
          node.textAlign = orient === 'left' ? 'right' : 'left'
          node.width = 1
          node.height = 1
        }
        break
      default:
        node = new Rect()
        node.width = item.width ? item.width : this.option.nodeWidth
        node.height = item.height ? item.height : this.option.nodeHeight
        break
    }

    node.name = item.title
    node.orient = orient
    node.stage2d = this.stage2d

    if (item.color) {
      node.initColor(item.color)
    }

    node.datahandle = item

    return node
  }

  initNode(data: Item[]) {
    this.nodes = []

    // 解析 json data, 并创建对应的节点
    this.nodeTree = this.parse(data, null, 'bottom');
  }

  parse(data: Item[] | undefined, parent: null | Node, orient: string): TreeItem[] {

    if (!data || data.length <= 0) {
      return []
    }

    const nodes = []

    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      let type

      if (this.option.type === 'tree') {
        type = item.type ? item.type : 'text'
      } else {
        type = item.type ? item.type : 'rect'
      }

      const node = this.createNode(type, item, orient)

      this.nodes.push(node)

      if (parent) {
        node.links.push({
          orient: orient,
          node: parent
        })
      }

      let top
      let right
      let bottom
      let left

      if (item.children) {
        top = this.parse(item.children.top, node, 'top')
        right = this.parse(item.children.right, node, 'right')
        bottom = this.parse(item.children.bottom, node, 'bottom')
        left = this.parse(item.children.left, node, 'left')
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

  initPosition(animate: boolean) {
    console.time('init position time')
    const spaceWidth = this.option.spaceWidth
    const spaceHeight = this.option.spaceHeight

    /**
     * 计算每个节点和其子节点所占空间大小
     *
     * @param {TreeItem[]}   data children data.
     * @param {boolean} isHorizontal children orient.
     * @internal
     */
    const boundingClientRect = (data: TreeItem[], isHorizontal: boolean): Space => {
      let width = 0
      let height = 0

      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        item.spaceWidth = Math.max(spaceWidth, item.node.width)
        item.spaceHeight = spaceHeight

        if (item.children) {
          const top = boundingClientRect(item.children.top, true)
          const right = boundingClientRect(item.children.right, false)
          const bottom = boundingClientRect(item.children.bottom, true)
          const left = boundingClientRect(item.children.left, false)

          item.spaceWidth += Math.max(left.width + right.width, top.width - spaceWidth, bottom.width - spaceWidth)
          item.spaceHeight += Math.max(top.height + bottom.height, left.height - spaceHeight, right.height - spaceHeight)
        }

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
    const setPosition = (data: TreeItem[], spaceX: number, spaceY: number, isHorizontal: boolean) => {
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
          const topSpaceWidth = item.children.top.reduce((a: number, b: TreeItem) => a + b.spaceWidth , 0)
          const bottomSpaceWidth = item.children.bottom.reduce((a: number, b: TreeItem) => a + b.spaceWidth , 0)
          const leftSpaceWidth = item.children.left.reduce((a: number, b: TreeItem) => Math.max(a, b.spaceWidth), 0)
          const leftSpaceHeight = item.children.left.reduce((a: number, b: TreeItem) => a + b.spaceHeight , 0)
          const rightSpaceHeight = item.children.right.reduce((a: number, b: TreeItem) => a + b.spaceHeight , 0)

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

    console.timeEnd('init position time')
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

    this.resetAndCache()
  }

  editNode(node: Node, title: string) {
    node.datahandle.title = title
    this.resetAndCache()
  }

  changeNodeType(type: string) {
    if (this.selected) {
      this.selected.datahandle.type = type
      this.resetAndCache()
    }
  }

  setColor(node: Node, color: string) {
    node.datahandle.color = color
    this.resetAndCache()
  }

  deleteNode(node: Node) {
    node.datahandle.deleted = true
    this.resetAndCache()
  }

  resetAndCache() {
    this.selected = null
    this.toolbar.disableDeleteNode()
    this.adder.hide()
    this.initNode(this.updateData())
    this.initPosition(false)
    localStorage.setItem(`${this.id}-data`, JSON.stringify(this.data))
  }


  clearNode() {
    const isClear = window.confirm('你确定要清除已缓存的节点吗？')

    if (isClear) {
      localStorage.removeItem(`${this.id}-translateX`)
      localStorage.removeItem(`${this.id}-translateY`)
      localStorage.removeItem(`${this.id}-data`)
      window.location.reload()
    }
  }

  setZoom(isOut: boolean, toolbar: Toolbar) {
    if (isOut) {
      this.stage2d.setScale(this.stage2d.scale - .05)
    } else {
      this.stage2d.setScale(this.stage2d.scale + .05)
    }

    toolbar.setZoomText(Math.round(this.stage2d.scale * 100))
  }

  saveImage() {
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

  saveJson() {
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

  render() {
    const scene = this.stage2d.getScene()
    scene.initContext()

    // 根据名称重新计算宽
    this.nodes.forEach((node) => {
      if(node.type === 'text' && node.textAlign === 'center') {
        node.width = Math.min(400, Math.max(scene.context.measureText(node.name).width))
      }
    })

    // 计算节点大小位置信息
    this.initPosition(true)

    scene.paint(() => {
      this.paint(scene.context)
    })
  }

  paint(context: CanvasRenderingContext2D) {
    const paintLine = this.option.type === 'mind' ? this.paintBrokenLine : this.paintLine

    // 画节点之间的联线
    context.beginPath()
    context.moveTo(0 , 0)
    this.nodes.forEach((node) => {
      if (node.links.length > 0) {
        node.links.forEach((link: Link) => {
          paintLine.call(this, context, link.orient, link.node, node)
        })
      }
    })
    context.moveTo(0 , 0)
    context.closePath()
    context.strokeStyle = '#7396bf'
    // context.lineWidth = 1

    context.stroke()

    context.lineWidth = 2

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

  // 绘制三次贝赛尔曲线
  paintLine(context: CanvasRenderingContext2D, orient: string, node: Node, toNode: Node) {
    const space = this.option.lineSpace

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

  // 绘制折线
  paintBrokenLine(context: CanvasRenderingContext2D, orient: string, node: Node, toNode: Node) {
    const space = this.option.lineSpace

    if (orient === 'bottom') {
      const x1 = node.x
      const y1 = node.y + (node.height / 2) + space
      const x2 = toNode.x
      const y2 = toNode.y - (toNode.height / 2) - space

      context.moveTo(x1, y1)
      context.lineTo(x1, y1 + (y2 - y1) / 2)
      context.lineTo(x2, y1 + (y2 - y1) / 2)
      context.lineTo(x2, y2)
    }

    if (orient === 'top') {
      const x1 = node.x
      const y1 = node.y - (node.height / 2) - space
      const x2 = toNode.x
      const y2 = toNode.y + (toNode.height / 2) + space

      context.moveTo(x1, y1)
      context.lineTo(x1, y1 + (y2 - y1) / 2)
      context.lineTo(x2, y1 + (y2 - y1) / 2)
      context.lineTo(x2, y2)
    }

    if (orient === 'right') {
      const x1 = node.x + (node.width / 2) + space
      const y1 = node.y
      const x2 = toNode.x - (toNode.width / 2) - space
      const y2 = toNode.y

      context.moveTo(x1, y1)
      context.lineTo(x1 + (x2 - x1) / 2, y1)
      context.lineTo(x1 + (x2 - x1) / 2, y2)
      context.lineTo(x2, y2)
    }

    if (orient === 'left') {
      const x1 = node.x - (node.width / 2) - space
      const y1 = node.y
      const x2 = toNode.x + (toNode.width / 2) + space
      const y2 = toNode.y

      context.moveTo(x1, y1)
      context.lineTo(x1 + (x2 - x1) / 2, y1)
      context.lineTo(x1 + (x2 - x1) / 2, y2)
      context.lineTo(x2, y2)
    }
  }

  initAdder() {
    this.adder = Adder.init(this.stage2d.container)

    // 添加节点回调
    this.adder.onAdd((orient: any) => {
      this.stage2d.drawing = false
      if (this.selected) {
        this.addNode(this.selected, orient, {
          title: 'new node',
          type: this.toolbar.nodeType
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
