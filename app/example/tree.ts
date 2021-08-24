import Mind from '../index';

const colors = ['#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f']

const myTree = document.createElement('div');

myTree.className = 'chart';

document.body.appendChild(myTree);

const tree = new Mind(myTree);

let nodes = [{
  title: 'HTML5',
  color: '#e03997'
},{
  title: 'CSS3',
  color: '#a333c8',
  children: {
    left: [{
      title: 'animate'
    },{
      title: 'CSS函数',
      color: '#a5673f',
      children: {
        left: [{
          title: 'calc'
        },{
          title: 'linear-gradient'
        },{
          title: 'radial-gradient'
        }]
      }
    },{
      title: 'flex',
      color: '#21ba45',
      children: {
        left: [{
          title: 'justify-content',
          children: {
            left: [{
              title: 'flex-start',
            },{
              title: 'flex-end',
            },{
              title: 'center',
            },{
              title: 'space-between',
            }]
          }
        },{
          title: 'align-items'
        },{
          title: 'flex-wrap'
        },{
          title: 'flex-grow'
        }]
      }
    },{
      title: 'grid'
    }]
  }
},{
  title: 'Javascript',
  color: '#f2711c',
  type: '',
  children: {
    bottom: [{
      title: 'String',
      children: {
        bottom: [{
          title: 'replace'
        }],
        top: [{
          title: 'slice'
        }]
      }
    },{
      title: 'Number',
      color: '#b5cc18',
      children: {
        left: [{
          title: 'NaN'
        }],
        bottom: [{
          title: 'toFixed'
        },{
          title: 'valueOf'
        },{
          title: 'toString'
        }]
      }
    },{
      title: 'Array',
      color: '#00b5ad',
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
      color: '#fbbd08',
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
    }]
  }
}]

tree.init(nodes);

tree.addEventListener('click', (e: any) => {
  console.log('click e: ', e)
})
