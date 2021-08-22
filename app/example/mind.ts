import Mind from '../index';

const colors = ['#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f']

const myChart = document.createElement('div');

myChart.className = 'chart';

document.body.appendChild(myChart);

const chart = new Mind(myChart);

const nodes = [{
  title: 'Javascript',
  type: '',
  children: {
    top: [],
    right: [],
    bottom: [{
      title: 'String'
    },{
      title: 'Number',
      children: {
        bottom: [{
          title: 'toFixed'
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
        right: [{
          title: 'random'
        },{
          title: 'floor'
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
