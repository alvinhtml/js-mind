interface EventAgent extends PointerEvent {
  path: Array<HTMLElement>
}

export interface ToolEvent {
  target: HTMLElement,
  type: string
}

const colors = ['#7396bf', '#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f']

export default class Toolbar {

  bar: HTMLDivElement

  // 点击回调
  callback: Function = () => {}

  // 拖动回调
  dragenter: Function = () => {}
  dragend: Function = () => {}

  // 填充颜色回调
  filled: Function = (color: string) => {}

  // 缩放百分比显示
  zoomTexter: HTMLElement

  // 删除节点按钮
  deleteNode: HTMLElement

  // 填充颜色按钮
  fillStyle: HTMLElement

  // 拖动目标类型
  targetType: string = 'rect'

  constructor(element: HTMLDivElement) {
    this.bar = element
    this.zoomTexter = element.querySelector('#zoomTexter') || document.createElement('li')
    this.deleteNode = element.querySelector('#deleteNode') || document.createElement('li')
    this.fillStyle = element.querySelector('#fillStyle') || document.createElement('li')

    // 拖动开始事件
    document.addEventListener('dragstart', (event: DragEvent) => {
      if (event.target instanceof HTMLElement) {
        this.targetType = event.target.dataset.type || 'rect'
      }
    }, false)

    // 拖动结束事件
    document.addEventListener('dragend', (event: DragEvent) => {
      setTimeout(() => {
        this.dragend()
      }, 0)
    }, false)

    // 点击事件代理
    element.onclick = (event: EventAgent) => {

      // 通过 path 找到触发事件的 li 元素
      const toolItem = event.path.find((item: HTMLElement) => {
        if (item.localName === 'li') {
          return item
        }
      })

      // 打开和关闭颜色选择器
      if (toolItem && toolItem.dataset.type === 'pick-color') {
        if (toolItem.className.indexOf('opened') !== -1) {
          toolItem.classList.remove('opened')
        } else {
          toolItem.classList.add('opened')
        }
        event.stopPropagation()
      }

      // 执行点击事件回调
      if (toolItem && this.callback) {
        this.callback({
          target: toolItem,
          type: toolItem.dataset.type
        })
      }
    }


    const pickColor: null | HTMLDivElement = this.fillStyle.querySelector('#pickColor')

    if (pickColor) {
      const fillhtml = colors.map(color => {
        return `<span style="background-color: ${color}" data-color="${color}"></span>`
      }).join('')

      pickColor.innerHTML = `<div>${fillhtml}</div>`

      pickColor.onclick = (e) => {
        e.stopPropagation()
        if (e.target instanceof HTMLElement && e.target.localName === 'span') {
          this.filled(e.target.dataset.color)
        }
      }
    }

    document.addEventListener('click', () => {
      this.fillStyle.classList.remove('opened')
    })
  }

  onClick(callback: Function) {
    this.callback = callback
  }

  onDrag(callback: Function) {
    this.dragenter = callback
  }

  onDragend(callback: Function) {
    this.dragend = callback
  }

  onFill(callback: Function) {
    this.filled = callback
  }

  setZoomText(text: number) {
    this.zoomTexter.textContent = text + '%'
  }

  enableDeleteNode() {
    this.deleteNode.classList.add('enabled')
    this.fillStyle.classList.add('enabled')
  }

  disableDeleteNode() {
    this.deleteNode.classList.remove('enabled')
    this.fillStyle.classList.remove('enabled')
  }


  static init(container: HTMLDivElement) {
    //创建 Adder Box
    const box = document.createElement('div')
    box.classList.add('toolbar')

    // 图标库
    // https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=24011
    // https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=748
    // https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=18802
    box.innerHTML = `
      <ul>
        <li class="tool-item enabled" data-type="info">
          <svg t="1634037178455" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2663" width="22" height="22"><path d="M512.50142 958.397886c-119.320573 0-231.499491-46.465265-315.871087-130.837884C112.258737 743.188406 65.792449 631.010511 65.792449 511.688915c0-119.319549 46.466288-231.499491 130.837884-315.871087C281.002952 111.445208 393.180847 64.979944 512.50142 64.979944s231.499491 46.465265 315.871087 130.837884c84.372619 84.372619 130.837884 196.551538 130.837884 315.871087 0 119.321596-46.465265 231.499491-130.837884 315.871087C744.000911 911.932622 631.821993 958.397886 512.50142 958.397886zM512.50142 105.962334c-223.718271 0-405.726581 182.00831-405.726581 405.726581s182.00831 405.726581 405.726581 405.726581c223.718271 0 405.727605-182.00831 405.727605-405.726581S736.220714 105.962334 512.50142 105.962334z" p-id="2664"></path><path d="M510.150886 775.953647c-18.107403 0-32.745798-14.678304-32.745798-32.785707L477.405087 452.191846c0-18.108426 14.638395-32.785707 32.745798-32.785707 18.107403 0 32.745798 14.678304 32.745798 32.785707l0 290.976094C542.896684 761.275343 528.258289 775.953647 510.150886 775.953647z" p-id="2665"></path><path d="M511.357364 296.458969m-45.080731 0a44.054 44.054 0 1 0 90.161463 0 44.054 44.054 0 1 0-90.161463 0Z" p-id="2666"></path></svg>
          <div class="help-info">
            <dl>
              <dt>使用帮助：</dt>
              <dd>1. 双击节点修改名称；</dd>
              <dd>2. 拖动图形到工作区，添加一个新的根节点；</dd>
              <dd>3. 选中节点，然后点击控制句柄添加子节点；</dd>
              <dd>4. 选中节点，使用调色盘改变节点；</dd>
              <dd>5. 选中节点，按 delete 删除节点；</dd>
            </dl>
          </div>
        </li>
        <li class="tool-item item-node enabled" data-type="rect" draggable="true">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M760 960H264c-110.5 0-200-89.5-200-200V264c0-110.5 89.5-200 200-200h496c110.5 0 200 89.5 200 200v496c0 110.5-89.5 200-200 200z"></path></svg>
        </li>
        <li class="tool-item item-node" data-type="circle" draggable="true">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z"></path></svg>
        </li>
        <li class="tool-item item-node" data-type="rect" draggable="true">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M442.7 145.8L66.1 798.2c-30.8 53.3 7.7 120 69.3 120h753.3c61.6 0 100.1-66.7 69.3-120L581.3 145.8c-30.8-53.3-107.8-53.3-138.6 0z"></path></svg>
        </li>
        <li class="tool-item item-node" data-type="diamond" draggable="true">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path d="M938 550.1l-404.1 233c-13.6 7.8-30.3 7.8-43.8 0L86 550.1c-29.4-16.9-29.4-59.3 0-76.3l404.1-233c13.6-7.8 30.3-7.8 43.8 0l404.1 233c29.3 17 29.3 59.4 0 76.3z"></path></svg>
        </li>
        <li class="tool-item item-node" data-type="rect" draggable="true">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M896.2 789H127.8c-29.5 0-48.8-30.9-36-57.4l230-474c6.7-13.8 20.7-22.5 36-22.5h308.3c15.3 0 29.3 8.7 36 22.5l230 474c12.9 26.5-6.4 57.4-35.9 57.4z"></path></svg>
        </li>
        <li id="fillStyle" class="tool-item" data-type="pick-color">
          <svg t="1633939528449" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3843" width="26" height="26"><path d="M204.4 524.9c-14.5 1.5-26.2 13.2-27.7 27.7-2.1 19.9 14.6 36.7 34.6 34.6 14.5-1.5 26.2-13.2 27.8-27.8 2-19.9-14.8-36.6-34.7-34.5zM265.4 473.7c21.8-1.9 39.4-19.5 41.4-41.4 2.5-28.5-21.2-52.3-49.7-49.7-21.8 1.9-39.4 19.5-41.4 41.4-2.6 28.4 21.2 52.2 49.7 49.7zM415.8 266.9c-28.5 1.8-51.6 24.9-53.4 53.4-2.2 34.5 26.4 63.1 60.9 60.9 28.5-1.8 51.6-24.9 53.4-53.4 2.1-34.6-26.4-63.1-60.9-60.9zM621.9 253.8c-35.1 2.2-63.4 30.6-65.6 65.6-2.7 42.4 32.4 77.6 74.8 74.8 35.1-2.2 63.4-30.6 65.6-65.6 2.8-42.4-32.3-77.5-74.8-74.8zM966.5 276.4c-0.5-7.6-4-14.6-9.8-19.6l-0.7-0.6c-5.2-4.5-11.9-7-18.8-7-8.3 0-16.2 3.6-21.6 9.9L574 652.4l-43.5 85.5 1.1 0.9-4.9 11.3 11.1-5.9 1.5 1.3 78-54.3 342.3-394c5-5.8 7.4-13.2 6.9-20.8z" p-id="3844"></path><path d="M897.8 476.3c-13.8-1.4-26.7 7.4-30.4 20.7-6.9 24.6-19.3 64.5-35.1 97.8C809.5 643 767.4 710.1 696.7 756c-72.2 46.9-142.7 56.7-189.2 56.7-37 0-72.2-6.1-101.7-17.7-26.9-10.5-46.4-24.6-54.9-39.7-3.4-6.1-7.2-12.9-11.2-20.2-17.2-31.1-36.6-66.5-49.7-77.4-15.9-13.2-39.1-15-59.8-15-8.1 0-40.8 1.3-48.5 1.3-33.1 0-49.4-6.5-56.1-22.4-17.8-42.3-7.3-114.3 26.8-183.4C205.2 331.4 300 253.3 412.6 224c40-10.6 81.2-18.9 121.3-18.9 85.6 0 187.8 32.8 252.5 77.2 11.4 7.8 26.9 5.8 35.7-4.9 10.4-12.6 7.1-31.4-6.8-39.8-23.3-14-57.9-34-86.3-47.1-60.3-27.9-123.7-41.9-189.2-41.9-68.1 0-148.8 16.4-217.2 47.2-78.1 35-135.2 85-179.4 147.5-36.4 51.4-67.8 111.1-80.1 168.7-7.5 35.1-6.8 57.4-2.4 87.8 4.2 29.2 13.4 52.5 26.9 67.5 22.4 25.1 51.5 37.4 89 37.4 13.9 0 56.3-5 63.1-5 7.4 0 12.2 1.2 14.4 3.8 6.4 7.4 14.4 22.4 23.7 39.9 7.5 14.1 15.9 30.1 25.4 45.3 12.1 19.5 36.9 40.4 66.5 55.9 27 14.1 71.9 31 132.2 31 72 0 148.3-23.6 226.7-70.1 74.9-44.4 123-118.9 150.2-173.6 19-38.3 34.7-87.2 43.8-119.1 4.8-17.3-7-34.7-24.8-36.5z" p-id="3845"></path></svg>
          <div id="pickColor" class="pick-color"></div>
        </li>
        <li></li>
        <li class="tool-item enabled" data-type="zoom-out" data-title="缩小">
          <svg t="1633772226810" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1887" width="28" height="28"><path d="M450.31 236.69c56.72 0 110.04 22.09 150.15 62.19 82.79 82.79 82.79 217.51 0 300.3-40.11 40.11-93.43 62.19-150.15 62.19s-110.04-22.09-150.15-62.19c-82.79-82.79-82.79-217.51 0-300.3 40.11-40.11 93.43-62.19 150.15-62.19m0-32c-62.53 0-125.07 23.86-172.78 71.57-95.42 95.42-95.42 250.13 0 345.55 47.71 47.71 110.24 71.57 172.78 71.57 62.53 0 125.07-23.86 172.78-71.57 95.42-95.42 95.42-250.13 0-345.55-47.71-47.72-110.24-71.57-172.78-71.57z" p-id="1888"></path><path d="M804.76 806.05c-17.54 17.54-46.24 17.54-63.78 0L570.94 636l63.78-63.78 170.05 170.05c17.53 17.54 17.53 46.24-0.01 63.78zM547.6 465.03H353.04c-8.84 0-16-7.16-16-16s7.16-16 16-16H547.6c8.84 0 16 7.16 16 16s-7.16 16-16 16z" p-id="1889"></path></svg>
        </li>
        <li id="zoomTexter" class="zoom-texter"></li>
        <li class="tool-item enabled" data-type="zoom-in" data-title="放大">
          <svg t="1633772197782" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1738" width="28" height="28"><path d="M450.31 236.69c56.72 0 110.04 22.09 150.15 62.19 40.11 40.11 62.19 93.43 62.19 150.15s-22.09 110.04-62.19 150.15c-40.11 40.11-93.43 62.19-150.15 62.19s-110.04-22.09-150.15-62.19c-82.79-82.79-82.79-217.51 0-300.3 40.11-40.11 93.43-62.19 150.15-62.19m0-32c-62.53 0-125.07 23.86-172.78 71.57-95.42 95.42-95.42 250.13 0 345.55 47.71 47.71 110.24 71.57 172.78 71.57 62.53 0 125.07-23.86 172.78-71.57 95.42-95.42 95.42-250.13 0-345.55-47.71-47.72-110.24-71.57-172.78-71.57z" p-id="1739"></path><path d="M804.76 806.05c-17.54 17.54-46.24 17.54-63.78 0L570.94 636l63.78-63.78 170.05 170.05c17.53 17.54 17.53 46.24-0.01 63.78zM547.6 465.03H353.03c-8.84 0-16-7.16-16-16s7.16-16 16-16H547.6c8.84 0 16 7.16 16 16s-7.16 16-16 16z" p-id="1740"></path><path d="M450.32 562.31c-8.84 0-16-7.16-16-16V351.75c0-8.84 7.16-16 16-16s16 7.16 16 16v194.56c0 8.84-7.16 16-16 16z" p-id="1741"></path></svg>
        </li>
        <li></li>
        <li class="tool-item enabled" data-type="copy-json" data-title="复制JSON数据">
          <svg t="1633770997894" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2894" width="22" height="22"><path d="M857.373005 65.290005 469.604424 65.290005c-34.211173 0-62.044078 27.832905-62.044078 62.043055l0 10.340509-63.076594 0c-25.993001 0-48.228421 16.346293-57.001225 39.293935L166.626995 176.967504c-34.21015 0-62.043055 27.832905-62.043055 62.043055l0 657.655358c0 34.21015 27.832905 62.043055 62.043055 62.043055l550.115086 0c34.21015 0 62.043055-27.832905 62.043055-62.043055l0-49.634444 78.587869 0c34.21015 0 62.043055-27.832905 62.043055-62.043055L919.41606 127.33306C919.41606 93.122911 891.583155 65.290005 857.373005 65.290005zM344.483752 179.035606l194.402595 0c10.833743 0 19.646456 8.813736 19.646456 19.646456 0 10.833743-8.813736 19.646456-19.646456 19.646456L344.483752 218.328517c-10.833743 0-19.646456-8.813736-19.646456-19.646456C324.836273 187.849342 333.650009 179.035606 344.483752 179.035606zM737.423099 896.665917c0 11.402701-9.278317 20.681018-20.681018 20.681018L166.626995 917.346935c-11.403724 0-20.681018-9.278317-20.681018-20.681018L145.945977 239.010559c0-11.402701 9.277294-20.681018 20.681018-20.681018l120.111588 0c8.197706 24.02723 30.977525 41.362037 57.744145 41.362037l194.402595 0c26.767644 0 49.54644-17.334807 57.744145-41.362037l120.111588 0c11.402701 0 20.681018 9.278317 20.681018 20.681018L737.422076 896.665917zM878.054023 784.988418c0 11.402701-9.278317 20.681018-20.681018 20.681018l-78.587869 0L778.785136 239.010559c0-34.21015-27.832905-62.043055-62.043055-62.043055L595.886549 176.967504c-8.771781-22.947641-31.007201-39.293935-57.001225-39.293935l-89.963964 0L448.921359 127.33306c0-11.403724 9.278317-20.681018 20.683065-20.681018l387.768581 0c11.402701 0 20.681018 9.277294 20.681018 20.681018L878.054023 784.988418z" p-id="2895"></path><path d="M620.597347 334.252737 260.748652 334.252737c-11.422144 0-20.681018 9.259898-20.681018 20.681018s9.258874 20.681018 20.681018 20.681018l359.849718 0c11.42112 0 20.681018-9.259898 20.681018-20.681018S632.018467 334.252737 620.597347 334.252737z" p-id="2896"></path><path d="M620.597347 454.201619 260.748652 454.201619c-11.422144 0-20.681018 9.259898-20.681018 20.681018 0 11.42112 9.258874 20.681018 20.681018 20.681018l359.849718 0c11.42112 0 20.681018-9.259898 20.681018-20.681018C641.278365 463.46254 632.018467 454.201619 620.597347 454.201619z" p-id="2897"></path><path d="M440.673511 574.151525 260.748652 574.151525c-11.422144 0-20.681018 9.259898-20.681018 20.681018 0 11.42112 9.258874 20.681018 20.681018 20.681018l179.924859 0c11.42112 0 20.681018-9.259898 20.681018-20.681018C461.35453 583.411423 452.093609 574.151525 440.673511 574.151525z" p-id="2898"></path></svg>
        </li>
        <li class="tool-item enabled" data-type="save-to-image" data-title="保存为图片">
          <svg t="1633771022342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3044" width="22" height="22"><path d="M841.71335 65.290005 182.285626 65.290005c-64.511269 0-116.995621 52.484352-116.995621 116.995621L65.290005 841.71335c0 64.511269 52.484352 116.995621 116.995621 116.995621l659.427724 0c64.511269 0 116.995621-52.484352 116.995621-116.995621L958.708971 182.285626C958.708971 117.774357 906.225643 65.290005 841.71335 65.290005zM182.285626 107.833961l659.427724 0c41.051975 0 74.451666 33.398668 74.451666 74.451666l0 136.557142c-150.09446 5.26184-290.370297 66.084091-396.978337 172.692131-49.960879 49.961902-89.841168 107.331517-118.694309 169.625282-83.496669-70.835302-204.372667-75.376735-292.65841-13.617136L107.833961 182.285626C107.833961 141.232628 141.232628 107.833961 182.285626 107.833961zM107.833961 841.71335 107.833961 702.627618c76.54228-74.311473 198.833511-74.234725 275.272437 0.24457-24.303522 65.298192-37.026288 135.112234-37.026288 206.91149 0 2.223644 0.343831 4.366448 0.977257 6.381337L182.285626 916.165016C141.232628 916.165016 107.833961 882.766348 107.833961 841.71335zM841.71335 916.165016 387.646807 916.165016c0.633427-2.01489 0.977257-4.157693 0.977257-6.381337 0-146.71755 57.053414-284.572244 160.647817-388.166647 98.570993-98.570993 228.166583-154.963351 366.894158-160.204725L916.166039 841.71335C916.165016 882.766348 882.766348 916.165016 841.71335 916.165016z" p-id="3045"></path><path d="M312.397986 413.458683c60.8376 0 110.332874-49.494251 110.332874-110.332874s-49.494251-110.332874-110.332874-110.332874-110.332874 49.494251-110.332874 110.332874S251.559363 413.458683 312.397986 413.458683zM312.397986 235.337913c37.378306 0 67.788919 30.40959 67.788919 67.788919s-30.40959 67.788919-67.788919 67.788919-67.788919-30.40959-67.788919-67.788919S275.018657 235.337913 312.397986 235.337913z" p-id="3046"></path></svg>
        </li>
        <li class="tool-item enabled" data-type="clear" data-title="清除缓存节点">
          <svg t="1633771036525" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3192" width="22" height="22"><path d="M909.050991 169.476903l-217.554898 0 0-31.346939c0-39.5866-32.205493-71.792093-71.793116-71.792093L408.15591 66.337871c-39.5866 0-71.792093 32.205493-71.792093 71.792093l0 31.346939L113.349581 169.476903c-11.013845 0-19.942191 8.940626-19.942191 19.954471s8.928347 19.954471 19.942191 19.954471l84.264149 0 0 640.687918c0 60.479443 49.203632 109.683075 109.683075 109.683075l416.474366 0c60.479443 0 109.683075-49.203632 109.683075-109.683075L833.454246 209.385844l75.595722 0c11.012821 0 19.942191-8.940626 19.942191-19.954471S920.063813 169.476903 909.050991 169.476903zM376.2482 138.130987c0-17.593703 14.314007-31.907711 31.907711-31.907711l211.547067 0c17.593703 0 31.907711 14.314007 31.907711 31.907711l0 31.346939L376.2482 169.477926 376.2482 138.130987zM793.569864 850.074785c0 38.486546-31.312146 69.798692-69.798692 69.798692L307.297828 919.873478c-38.486546 0-69.798692-31.312146-69.798692-69.798692L237.499136 211.042577l556.070728 0L793.569864 850.074785z" p-id="3193"></path><path d="M510.662539 861.276918c11.012821 0 19.954471-8.92937 19.954471-19.942191L530.61701 294.912753c0-11.013845-8.94165-19.942191-19.954471-19.942191s-19.954471 8.928347-19.954471 19.942191L490.708068 841.334727C490.708068 852.347548 499.649717 861.276918 510.662539 861.276918z" p-id="3194"></path><path d="M374.562814 801.449321c11.012821 0 19.954471-8.92937 19.954471-19.942191L394.517285 354.74035c0-11.013845-8.94165-19.942191-19.954471-19.942191s-19.954471 8.928347-19.954471 19.942191l0 426.76678C354.608344 792.519951 363.549993 801.449321 374.562814 801.449321z" p-id="3195"></path><path d="M649.832182 801.449321c11.012821 0 19.954471-8.92937 19.954471-19.942191L669.786653 354.74035c0-11.013845-8.94165-19.942191-19.954471-19.942191s-19.954471 8.928347-19.954471 19.942191l0 426.76678C629.877711 792.519951 638.81936 801.449321 649.832182 801.449321z" p-id="3196"></path></svg>
        </li>

        <li class="tool-item" data-type="link" data-title="连线">
          <svg t="1633771137435" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3342" width="22" height="22"><path d="M818.732963 208.222345c-8.163937-30.466895-27.702945-55.929824-55.019081-71.701019l-96.015797-55.434543c-56.388265-32.55444-128.750339-13.165858-161.304779 43.221384L209.587436 638.392642c-5.41022 4.086062-8.756431 10.701736-8.363482 17.98256l15.232936 282.377252c0.384763 7.143701 4.366448 13.605879 10.574846 17.163915 3.243881 1.860371 6.864338 2.793626 10.488889 2.793626 3.313465 0 6.631024-0.780783 9.667174-2.346441L497.492588 827.294966c4.306072-2.220574 7.503904-5.726421 9.411347-9.79918l279.395338-483.926618c0.296759-0.434905 0.61296-0.849344 0.881067-1.311879 0.357134-0.618077 0.677429-1.248434 0.964978-1.885953l18.789948-32.54523C822.707484 270.50997 826.895877 238.688217 818.732963 208.222345zM589.014024 110.041232c19.584034-5.244444 40.034808-2.555196 57.59065 7.581676l96.015797 55.434543c17.556864 10.135848 30.113855 26.501584 35.361369 46.083571 5.246491 19.580964 2.554172 40.033785-7.581676 57.59065l-9.30083 16.109909L533.629623 161.511487l9.30083-16.109909C553.066301 127.845737 569.43306 115.287723 589.014024 110.041232zM512.535189 198.047612l227.468688 131.329071L496.90828 750.430344l-4.188392-19.609617c-2.114151-9.900487-10.859325-16.692171-20.60734-16.692171-1.394766 0-2.809999 0.140193-4.229325 0.428765l-50.179866 10.211573-13.875009-46.64025c-3.116991-10.475586-13.71435-16.838503-24.430412-14.654768l-50.011021 10.18906-13.328563-46.080501c-1.577938-5.455245-5.288446-10.042727-10.290367-12.726859-5.004991-2.688225-10.878768-3.238764-16.295128-1.539053l-20.392446 6.40692L512.535189 198.047612zM244.301052 671.725818l37.225833-11.69332 12.739139 44.045145c3.053546 10.559497 13.69286 17.005302 24.476461 14.809287l50.15633-10.219759 13.873985 46.638203c3.116991 10.475586 13.71435 16.836457 24.426319 14.654768l48.627511-9.896394 7.93574 37.156248L256.827343 903.925251 244.301052 671.725818z" p-id="3343"></path></svg>
        </li>
        <li id="deleteNode" class="tool-item" data-type="delete" data-title="删除节点">
          <svg t="1633771213584" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4923" width="22" height="22"><path d="M502.690909 0h18.618182v46.545455h-18.618182z" fill="#1277B5" p-id="4924"></path><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 979.781818c-258.327273 0-467.781818-209.454545-467.781818-467.781818S253.672727 46.545455 512 46.545455c258.327273 0 467.781818 209.454545 467.781818 467.781818s-209.454545 465.454545-467.781818 465.454545z" fill="" p-id="4925"></path><path d="M702.836364 670.254545L544.581818 512l158.254546-158.254545c9.309091-9.309091 9.309091-23.272727 0-32.581819-9.309091-9.309091-23.272727-9.309091-32.581819 0L512 479.418182l-158.254545-158.254546c-9.309091-9.309091-23.272727-9.309091-32.581819 0-9.309091 9.309091-9.309091 23.272727 0 32.581819l158.254546 158.254545-158.254546 158.254545c-9.309091 9.309091-9.309091 23.272727 0 32.581819 9.309091 9.309091 23.272727 9.309091 32.581819 0l158.254545-158.254546 158.254545 158.254546c9.309091 9.309091 23.272727 9.309091 32.581819 0 9.309091-6.981818 9.309091-23.272727 0-32.581819z" fill="" p-id="4926"></path></svg>
        </li>
        <li class="tool-item enabled" data-type="clear" data-title="清除缓存节点">
          <svg t="1633771267182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7059" width="22" height="22"><path d="M533.333333 981.333333c66.046667 0 129.66-14.046667 189.073334-41.74a449.473333 449.473333 0 0 0 149.333333-112.666666 21.333333 21.333333 0 0 0-32.213333-28A405.333333 405.333333 0 0 1 533.333333 938.666667c-223.5 0-405.333333-181.833333-405.333333-405.333334s181.833333-405.333333 405.333333-405.333333c168.166667 0 316.16 101.713333 376.98 256H746.666667a21.333333 21.333333 0 0 0 0 42.666667h213.333333a21.333333 21.333333 0 0 0 21.333333-21.333334V192a21.333333 21.333333 0 0 0-42.666666 0v150.266667A448.226667 448.226667 0 1 0 533.333333 981.333333z" fill="#5C5C66" p-id="7060"></path></svg>
        </li>

      </ul>
    `

    document.body.appendChild(box)
    box.style.marginLeft = `-${box.clientWidth / 2}px`

    const toolbar = new Toolbar(box)

    // 拖动事件
    container.addEventListener('dragenter', (event: DragEvent) => {
      toolbar.dragenter(toolbar.targetType, event)
    }, false)

    return toolbar
  }
}
