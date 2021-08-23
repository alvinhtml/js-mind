import Mind from '../index';

const colors = ['#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f']

const myChart = document.createElement('div');

myChart.className = 'chart';

document.body.appendChild(myChart);

const chart = new Mind(myChart);

const nodes = [{
  title: 'CSS',
  children: {
    left: [{
        title: 'background'
      },{
        title: 'border',
        children: {
          left: [{
              title: 'left'
            },{
              title: 'right'
            },{
              title: 'bottom'
            },{
              title: 'top'
          }]
        }
      },{
        title: 'text'
      },{
        title: 'font'
    }]
  }
},{
  title: 'Javascript',
  type: '',
  children: {
    top: [{
      title: 'e45'
    }],
    right: [],
    bottom: [{
      title: 'String',
      children: {
        bottom: [{
          title: 'bb'
        }],
        top: [{
          title: 'cc'
        }]
      }
    },{
      title: 'Number',
      children: {
        left1: [{
          title: 'aa'
        }],
        bottom: [{
          title: 'toFixed',
          children: {
            bottom: [{
              title: 'test'
            }]
          }
        }],
        bottom1: [{
          title: 'map'
        },{
          title: 'forEach'
        },{
          title: 'reduce'
        }]
      }
    },{
      title: 'Array',
      children: {
        bottom: [{
          title: 'map'
        },{
          title: 'forEach'
        },{
          title: 'reduce'
        }]
      }
    },{
      title: 'Math',
      children: {
        left: [{
          title: 'random'
        },{
          title: 'floor'
        }],
        right: [{
          title: 'max'
        },{
          title: 'min'
        }]
      }
    }],
    left: []
  }
}]

chart.init(nodes);

chart.addEventListener('click', (e: any) => {
  console.log('click e: ', e)
})
