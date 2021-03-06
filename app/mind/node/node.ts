import Stage from "../stage"
import { lighten, darken, alpha } from '../../utils/tool'

import { CLICK, MOUSEUP, MOUSEDOWN, MOUSEMOVE, MOUSEWHEEL } from '../../constants'

interface ChartEvent {
  mouseX: number
  mouseY: number
  pageX: number
  pageY: number
  target: Node
}

interface Link {
  orient: string
  node: Node
}


interface Indexed {
  [prop: string]:
  | number
  | string
  | (<K extends keyof this,
    T extends {
      [key in K]: number
    }>(props: T) => void)
}

type Values<T> = T[keyof T]

const pattern = '#7396bf'
const mouseOverPattern = lighten('#7396bf')
const areaPattern = lighten('#7396bf', 90)

export default class Node {
  stage2d: Stage
  chart2d: any

  // 类型
  type: string

  //形状的X坐标
  x: number = 0

  //形状的Y坐标
  y: number = 0

  // 自定义位置
  // customPosition: null | number[] = null

  width: number = 100

  height: number = 38

  name: string = ''

  //填充颜色或图案
  pattern = pattern

  //填充颜色或图案 mouseover
  mouseOverPattern = mouseOverPattern

  areaPattern = areaPattern

  actived: boolean = false

  //临时禁用
  disabled: boolean = false

  recoverAnimateIng = false

  links: Link[] = []

  orient: string

  datahandle: any

  constructor() {
    this.initColor('#7396bf')
  }

  clickAnimate() {

  }

  easeOut(t: number, b: number, c: number, d: number) {
    return -c * (t /= d) * (t - 2) + b;
  }

  animate<
    Keys extends PropertyKey,
    Value extends number,
    Props extends Record<Keys, Value>
    >(props: Props, speed: number = 400) {
    //属性原始值
    const initialValues: Indexed = {}

    //属性变化量
    const changeValues: Indexed = {}

    for (let key in props) {
      if (key === 'eAngle') {
        initialValues[key] = ((this as any)[key] * 100) as Props[typeof key]
        changeValues[key] = (props[key] as number * 100 - (initialValues as any)[key]) as Props[typeof key]
      } else {
        initialValues[key] = (this as any)[key]
        changeValues[key] = (props[key] as number - (this as any)[key]) as Props[typeof key]
      }
    }

    let time = 0;
    let durationTime = speed / 1000


    const step = () => {
      time = time + this.stage2d.interval

      if (time > speed) {
        time = speed
      }

      for (let key in changeValues) {

        if (key === 'eAngle') {
          //通过缓动函数求出某一属性在时间轴上对应的过度值
          (this as any)[key] = this.easeOut(time / 1000, initialValues[key] as number, changeValues[key] as number, durationTime) / 100
        } else {
          //通过缓动函数求出某一属性在时间轴上对应的过度值
          (this as any)[key] = this.easeOut(time / 1000, initialValues[key] as number, changeValues[key] as number, durationTime)
        }

        // console.table([
        //     {
        //         key: key
        //         time,
        //         initialValues: initialValues[key],
        //         changeValue: changeValues[key],
        //         speed,
        //         value: this[key],
        //         eAngle: props[key] * 100
        //     }
        // ])
      }

      if (time < speed) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  //鼠标事件检测
  triggerEvent() {

    this.stage2d.dispatchTarget(this)

    // const events = this.stage2d.events
    //
    //
    // if () {
    //
    // }
    //
    //
    //
    //
    //
    //
    // if (events.length > 0) {
    //   //遍历事件列表，以响应多个事件
    //   events.forEach((event, index) => {
    //     switch (event.eventType) {
    //       case CLICK:
    //         const clickPointQueue = this.stage2d.clickPointQueue
    //
    //         //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
    //         if (!clickPointQueue.isEmpty()) {
    //           event.callback(this.getStageEvent())
    //
    //           // 先复原，然后播放点击动画,
    //           // this.chart2d.recover()
    //
    //           if (this.recoverAnimateIng) {
    //             this.recoverAnimateIng = false
    //           } else {
    //             this.clickAnimate()
    //           }
    //         }
    //
    //         break;
    //
    //       case MOUSEDOWN:
    //         const mousedownPointQueue = this.stage2d.mousedownPointQueue
    //
    //         //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
    //         if (!mousedownPointQueue.isEmpty()) {
    //           event.callback(this.getStageEvent())
    //         }
    //
    //         break;
    //
    //       case MOUSEUP:
    //         const mouseupPointQueue = this.stage2d.mouseupPointQueue
    //
    //         //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
    //         if (!mouseupPointQueue.isEmpty()) {
    //           event.callback(this.getStageEvent())
    //         }
    //
    //         break;
    //
    //       case MOUSEMOVE:
    //         const mousemovePointQueue = this.stage2d.mousemovePointQueue
    //
    //         //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
    //         if (!mousemovePointQueue.isEmpty()) {
    //           event.callback(this.getStageEvent())
    //         }
    //
    //         break;
    //
    //       default:
    //         break;
    //     }
    //   })
    // }
  }

  // 初始化节点颜色
  initColor(hex: string) {
    if (/^#([a-fA-F\d]{6}|[a-fA-F\d]{3})$/.test(hex)) {
      this.pattern = hex
      this.mouseOverPattern = lighten(hex)
      this.areaPattern = lighten(hex, 90)
    } else {
      console.error('Only hex colors are supported')
    }
  }

  getStageEvent(): ChartEvent {
    return {
      mouseX: Math.round(this.stage2d.mouseX / this.stage2d.pixelRatio),
      mouseY: Math.round(this.stage2d.mouseY / this.stage2d.pixelRatio),
      pageX: this.stage2d.pageX,
      pageY: this.stage2d.pageY,
      target: this
    }
  }
}
