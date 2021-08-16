//事件对象
export default class Event2d {
  eventType: Symbol
  callback: Function

  constructor (event: Symbol, callback: Function) {
    //事件类型
    this.eventType = event

    //事件回调
    this.callback = callback
  }
}
