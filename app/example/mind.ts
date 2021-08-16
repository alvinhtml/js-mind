import Mind from '../index';

const myChart = document.createElement('div');

myChart.className = 'chart';

document.body.appendChild(myChart);

const chart = new Mind(myChart);

const nodes = [{
  title: 'Javascript',
  type: '',
  details: '',
  child: {
    orient: 'auto',
    nodes: [{
      title: 'String',
    },{
      title: 'Number',
    },{
      title: 'Math',
    },{
      title: 'Array',
      child: {
        nodes: [{
          title: 'Map'
        },{
          title: 'forEach'
        }]
      }
    },{
      title: 'RegExp',
    }]
  }
}]

chart.init(nodes);

chart.addEventListener('click', (e: any) => {
    console.log('click e: ', e.target.name, e.target.value)
})
