import Mind from '../index';

const colors = ['#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f']

const myChart = document.createElement('div');

myChart.className = 'chart';

document.body.appendChild(myChart);

const chart = new Mind(myChart);

const nodes = [{
  title: 'Javascript',
  type: '',
  details: '',
  children: [{
    orient: 'auto',
    nodes: [{
      title: 'String'
    },{
      title: 'Number'
    },{
      title: 'Math',
    },{
      title: 'Array',
      children: [{
        nodes: [{
          title: 'Map'
        },{
          title: 'forEach'
        }]
      }]
    },{
      title: 'RegExp'
    }]
  }]
}]

chart.init(nodes);

chart.addEventListener('click', (e: any) => {
  console.log('click e: ', e.target.name, e.target.value)
})
