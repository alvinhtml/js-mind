# js-mind


## Development

- Install npm packages

```
npm install
```

- Launch dev server

```
npm run start
```

- Build

```
npm run build
```

## 演示

- [树图](http://example.alvinhtml.com/js-mind/example/tree.html)
- [流程图](http://example.alvinhtml.com/js-mind/example/mind.html)

## Install js-mind

```bash
npm install js-mind --save
```

## 部分功能实现思路

### Mind

Mind 类提供对外接口，维护节点树，并调用其它类完成相关工作

### Stage

Stage 类主要功能：

- 画布管理：维护画布的宽高、缩放比例、偏移位置等信息
- 事件管理：添加不同类型的事件，储存回调函数

### Scene

Scene 类主要功能：

- 绘制管理
- 画笔状态管理

### Node

Node 和其派生类主要功能：

- 节点绘制
- 事件检测：检测鼠标事件的坐标是否在自身宽高以内，如果是，调用 Stage 中对应的事件回调函数
- 动画管理：主要是节点属性的动态更新

### Liner

- 线条管理
- 不同类型的线条绘制
- 缓存线条，线条绘制比较耗费性能，解决思路如下
  - 当没有缓存的时候，绘制所有线条到 CanvasA, 并缓存 CanvasA
  - 当有缓存的时候，将缓存的 CanvasA 绘制到主 Canvas
  - 节点树发生变化时清除 CanvasA 缓存

### Undo 类

实现撤销重做功能

- 用户更新节点树时，通过 `diff` 算出前后节点树对应的 `data` 差异，并保存为 Step
- 用户撤销重做，根据当前节点树和 Step 做对比，还原出前一步或后一步的 `data`
- 更新 `data` 并重绘
