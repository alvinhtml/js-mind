import Mind from '../index';

const colors = ['#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f']

const myMind = document.createElement('div');

myMind.className = 'chart';

document.body.appendChild(myMind);

const mind = new Mind(myMind);

let nodes = [{
  title: '开始',
  type: 'circle',
  color: '#21ba45',
  children: {
    bottom: [{
      title: '设置初始值',
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
  }
}]

mind.init(nodes);

mind.addEventListener('click', (e: any) => {
  console.log('click e: ', e)
})
