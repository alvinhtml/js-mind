// import Mind from '../index';
const Mind = (window as any).Mind.default

/*
 * 解决 TS2451: Cannot redeclare block-scoped variable
 * 如果一个 .ts 文件没有包含 import 或 export，那么它会被视为脚本，该文件中所有的内容都会被视为全局的，其它文件可以直接使用。反之如果使用了 import 或 export，那该文件就会被视为一个 module，里面的内容只有被别的文件 import 了才能使用。
 * 添加import或export，将index.ts变为一个模块。
 */
export {}

const colors = ['#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f']

const myMind = document.createElement('div');

myMind.id = 'mind'
myMind.className = 'chart';

document.body.appendChild(myMind);

const mind = new Mind(myMind);

let nodes = [{
  title: '开始',
  type: 'circle',
  color: '#21ba45',
  children: {
    bottom: [{
      title: '等待接收数据',
      children: {
        bottom: [{
          title: 'N=0?',
          type: 'diamond',
          color: '#f2711c',
          children: {
            bottom: [{
              title: '接收标志信息',
              children: {
                bottom: [{
                  title: 'N=1',
                  type: 'diamond',
                  color: '#f2711c',
                  children: {
                    bottom: [{
                      title: '显示烟雾',
                    }]
                  }
                }]
              }
            }],
            right: [{
              title: '接收浓度值',
              children: {
                bottom: [{
                  title: 'N=0',
                  type: 'diamond',
                  color: '#f2711c',
                  children: {
                    bottom: [{
                      title: '显示一氧化碳',
                    }]
                  }
                }]
              }
            }]
          }
        }]
      }
    }]
  }
}]

// let nodes = [{
//   title: 'root',
//   type: 'circle'
// }];

mind.init(nodes);

mind.addEventListener('click', (e: any) => {
  console.log('click e: ', e)
})
