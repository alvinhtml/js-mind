import Node from './node'

//饼状图
export default class Text extends Node {

  radius: number = 6

  // 名称自行换行
  texts: null | string[] = null

  textAlign: 'left' | 'right' | 'center' = 'left'

  constructor() {
    super()
    this.type = 'text'
  }

  breakStr(context: CanvasRenderingContext2D) {
    const width = 480
    let text = this.name

    // 使用二分查找，如果一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。
    const findBreakPoint = (text: string) => {
      let min = 0
      let max = text.length - 1

      while (min <= max) {
        const middle = Math.floor((min + max) / 2)
        const middleWidth = context.measureText(text.substr(0, middle)).width
        const oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width

        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
          return middle;
        }

        if (middleWidth < width) {
          min = middle + 1
        } else {
          max = middle - 1
        }
      }

      return -1
    }


    const result = []
    let breakPoint = 0

    // 对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止
    while ((breakPoint = findBreakPoint(text)) !== -1) {
      result.push(text.substr(0, breakPoint))
      text = text.substr(breakPoint)
    }

    if (text) {
      result.push(text);
    }

    return result
  }

  paintTitle(context: CanvasRenderingContext2D) {
    context.save()
    context.textAlign = this.textAlign

    if (!this.texts) {
      this.texts = this.breakStr(context)
      console.log("texts", this.texts);
    }

    //绘制名称
    const offsetY = (this.texts.length - 1) * 18 / 2

    for(let i = 0; i < this.texts.length; i++) {
      context.fillText(this.texts[i], this.x, this.y + i * 18 - offsetY)
    }

    context.restore()
  }

  // 使用缓存
  // paintCache(context: CanvasRenderingContext2D) {
  //   if (this.cache) {

  //   }
  // }

  paint(context: CanvasRenderingContext2D) {

  }
}
