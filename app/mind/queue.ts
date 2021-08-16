export default class Queue<T> {
  private items: Array<T>;

  constructor () {
    this.items = []
  }

  //向队列尾部添加一个新的项
  enqueue(item: T) {
    this.items.push(item)
  }

  //从队列中取出一个元素，并返回该元素
  dequeue() {
    return this.items.shift()
  }

  //查看队列最前面的元素
  front(): T | undefined {
    return this.items[0]
  }

  //查看队列是否为空，如果为空，返回true；否则返回false
  isEmpty(): boolean {
    return this.items.length == 0
  }

  //查看队列的长度
  size(): number {
    return this.items.length
  }

  //清空队列
  clear() {
    this.items = []
  }
}
