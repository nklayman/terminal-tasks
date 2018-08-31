const TaskList = require('./index')

const list = new TaskList(['First Task', { name: 'Second Task' }], {
  pendingChar: '→ ',
  ora: { color: 'magenta' }
})

setTimeout(() => {
  list.next()
}, 1000)
setTimeout(() => {
  list.info('It worked')
}, 2000)
