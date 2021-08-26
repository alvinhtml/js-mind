import Queue from './queue'
import Scene from './scene'
import Point from './point'
import Event2d from './event'
import { CLICK, MOUSEUP, MOUSEDOWN, MOUSEMOVE, MOUSEOUT, MOUSESCROLL } from '../constants'

import { getPixelRatio } from '../utils/tool'

//iDOMHighResTimeStamp
let lastIDOMHighResTimeStamp = 0

// 舞台<Stage>：大小位置事件
export default class Stage {

  public id: string = 'mind'

  // 容器, canvas 元素的 parent
  public container: HTMLDivElement

  // 舞台的宽和高，既是容器的宽和高，实际也是 canvas 的宽和高
  public width: number
  public height: number

  // 场景
  public scenes: Array<Scene> = []


  // 获取舞台相对于当前视窗的偏移
  public offsetX: number
  public offsetY: number

  // 当前舞台的缩放
  public scale = 1

  //当前舞台的偏移
  public translateX: number = 0
  public translateY: number = 0

  public drawing: boolean = false

  // 设备像素比
  public pixelRatio = 1 //pixelRatio

  // 鼠标 X
  public mouseX: number = 0

  // 鼠标 Y
  public mouseY: number = 0

  // 鼠标相对于页面 X
  public pageX: number = 0

  // 鼠标相对于页面 Y
  public pageY: number = 0

  // 当前帧距离上一帧的时间间隔
  public interval: number = 0

  public isVisibility: boolean = true

  public clickPointQueue = new Queue<Point>()
  public mouseupPointQueue = new Queue<Point>()
  public mousedownPointQueue = new Queue<Point>()
  public mousemovePointQueue = new Queue<Point>()

  //事件列表
  public events: Array<Event2d>

  constructor(container: HTMLDivElement) {
    this.container = container
    this.width = container.clientWidth
    this.height = container.clientHeight
    this.container.style.position = 'relative'
    this.id = container.id || 'mind'

    const rect = container.getBoundingClientRect()

    this.offsetX = rect.x
    this.offsetY = rect.y

    this.translateX = parseInt(localStorage.getItem(`${this.id}-translateX`) || '0', 10)
    this.translateY = parseInt(localStorage.getItem(`${this.id}-translateY`) || '0', 10)

    const context = document.createElement('canvas').getContext('2d')

    if (context) {
      this.setPixelRatio(context)
    }

    this.events = []

    this.initEventListener()

    document.addEventListener("visibilitychange", () => {
      this.isVisibility = document.visibilityState === 'visible'
    })

    this.requestAnimationFrame()


    let lastX = 0
    let lastY = 0

    this.addEventListener('mousedown', (e: any) => {
      if (!e.target) {
        this.drawing = true
        this.container.style.cursor = 'grab'
        lastX = e.mouseX
        lastY = e.mouseY
      }
    })

    this.addEventListener('mouseup', (e: any) => {
      if (!e.target) {
        this.drawing = false
        this.container.style.cursor = 'auto'
        localStorage.setItem(`${this.id}-translateX`, this.translateX.toString())
        localStorage.setItem(`${this.id}-translateY`, this.translateY.toString())
      }
    })

    this.addEventListener('mousemove', (e: any) => {
      if (this.drawing) {
        this.translateX = this.translateX + (e.mouseX - lastX)
        this.translateY = this.translateY + (e.mouseY - lastY)
      }
      lastX = e.mouseX
      lastY = e.mouseY
    })
  }

  initTranslate(width: number, height: number) {
    this.translateX = (this.width / 2) - (width / 2)
    this.translateY = (this.height / 2) - (height / 2)
  }


  //初始化事件监听
  initEventListener() {
    //添加事件监听
    document.addEventListener("mouseup", (e: MouseEvent) => {
      this.mouseupPointQueue.enqueue(new Point(this.mouseX, this.mouseY))
    }, false)

    this.container.addEventListener("mousedown", (e: MouseEvent) => {
      this.mousedownPointQueue.enqueue(new Point(this.mouseX, this.mouseY))
    }, false)

    this.container.addEventListener("click", (e: MouseEvent) => {
      this.clickPointQueue.enqueue(new Point(this.mouseX, this.mouseY))
    }, false)

    this.container.addEventListener("mousemove", (e: MouseEvent) => {
      this.pageX = e.pageX
      this.pageY = e.pageY
      this.mouseX = (e.pageX - this.offsetX) * this.pixelRatio
      this.mouseY = (e.pageY - this.offsetY) * this.pixelRatio

      this.mousemovePointQueue.enqueue(new Point(this.mouseX, this.mouseY))
    }, false)

    //缩放事件
    this.container.addEventListener('mousewheel', (e: WheelEvent) => {
      //缩放
      this.stageScroll(e)
    }, false)
  }


  //创建一个场景, 并返回 Scene
  getScene(): Scene {
    const scene = new Scene(this)
    this.scenes.push(scene)
    return scene
  }

  setPixelRatio(context: CanvasRenderingContext2D) {
    this.pixelRatio = getPixelRatio(context)
  }

  addEventListener(event: string, callback: Function) {
    let eventConst

    switch (event) {
      case 'click':
        eventConst = CLICK
        break

      case 'mouseup':
        eventConst = MOUSEUP
        break

      case 'mousedown':
        eventConst = MOUSEDOWN
        break

      case 'mousemove':
        eventConst = MOUSEMOVE
        break

      case 'mouseout':
        eventConst = MOUSEOUT
        break

      case 'DOMMouseScroll':
        eventConst = MOUSESCROLL
        break

      default:
        eventConst = CLICK
        break
    }

    this.events.push(new Event2d(eventConst, callback))
  }

  clearEventPoint() {
    if (!this.mouseupPointQueue.isEmpty()) {
      this.events.forEach((event: Event2d) => {
        if (event.eventType === MOUSEUP) {
          event.callback({
            mouseX: Math.round(this.mouseX / this.pixelRatio),
            mouseY: Math.round(this.mouseY / this.pixelRatio),
            pageX: this.pageX,
            pageY: this.pageY,
            target: null
          })
        }
      })

      this.mouseupPointQueue.clear()
    }

    if (!this.mousedownPointQueue.isEmpty()) {
      this.events.forEach((event: Event2d) => {
        if (event.eventType === MOUSEDOWN) {
          event.callback({
            mouseX: Math.round(this.mouseX / this.pixelRatio),
            mouseY: Math.round(this.mouseY / this.pixelRatio),
            pageX: this.pageX,
            pageY: this.pageY,
            target: null
          })
        }
      })

      this.mousedownPointQueue.clear()
    }

    if (!this.mousemovePointQueue.isEmpty()) {
      this.events.forEach((event: Event2d) => {
        if (event.eventType === MOUSEMOVE) {
          event.callback({
            mouseX: Math.round(this.mouseX / this.pixelRatio),
            mouseY: Math.round(this.mouseY / this.pixelRatio),
            pageX: this.pageX,
            pageY: this.pageY,
            target: null
          })
        }
      })

      this.mousemovePointQueue.clear()
    }

    if (!this.clickPointQueue.isEmpty()) {
      this.events.forEach((event: Event2d) => {
        if (event.eventType === CLICK) {
          event.callback({
            mouseX: Math.round(this.mouseX / this.pixelRatio),
            mouseY: Math.round(this.mouseY / this.pixelRatio),
            pageX: this.pageX,
            pageY: this.pageY,
            target: null
          })
        }
      })

      this.clickPointQueue.clear()
    }
  }

  requestAnimationFrame() {
    const frame = (iDOMHighResTimeStamp: number) => {

      //计算每次绘制的时间间隔
      this.interval = iDOMHighResTimeStamp - lastIDOMHighResTimeStamp
      lastIDOMHighResTimeStamp = iDOMHighResTimeStamp

      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  stageScroll(e: WheelEvent) {
    console.log('detail', e.detail, e);

    //判定鼠标指针在画布内
    if (
      Math.abs(e.pageX) > this.offsetX
      && Math.abs(e.pageX) < this.offsetX + this.width
      && Math.abs(e.pageY) > this.offsetY
      && Math.abs(e.pageY) < this.offsetY + this.height
    ) {

      //阻止冒泡
      e.stopPropagation()

      //计算出缩放前的鼠标在场景中的 X、Y
      const beforeX = ((e.pageX - this.offsetX) - this.translateX) / this.scale
      const beforeY = ((e.pageY - this.offsetY) - this.translateY) / this.scale


      if (e.deltaY < 0) {
        if (this.scale > .2) {
          this.scale -= .1
        }
      } else {
        if (this.scale < 4) {
          this.scale += .1
        }
      }

      this.translateX = -beforeX * this.scale + (e.pageX - this.offsetX)
      this.translateY = -beforeY * this.scale + (e.pageY - this.offsetY)
    }

    console.log(this.scale)
  }
}
