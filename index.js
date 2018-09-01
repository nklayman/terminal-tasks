const ora = require('ora')

module.exports = class terminalTasks {
  constructor (tasks, options) {
    if (!tasks) tasks = []
    if (!options) options = {}
    tasks.forEach((task, index) => {
      // Covert all tasks to objects
      task = makeTask(task, index === 0 /* Status should be running */)
      tasks.splice(index, 1, task)
    })

    this.tasks = tasks

    if (!options.pendingChar) options.pendingChar = '- '
    this.options = options
    if (this.tasks.length > 0) this.showList()
  }
  showList () {
    const names = this.tasks.map(task => task.name)
    this.spinner = ora({
      text: names.join(`\n${this.options.pendingChar}`),
      ...(this.options.ora || {}),
      ...(this.tasks[0].ora || {})
    }).start()
  }
  next (message) {
    if (this.tasks.length > 0) {
      this.spinner.succeed(message || this.tasks[0].name)
      this.tasks.splice(0, 1)
    }
    if (this.tasks.length > 0) {
      // Start next spinner if there are tasks left
      this.showList()
    }
  }
  warn (message) {
    if (this.tasks.length > 0) {
      this.spinner.warn(message || this.tasks[0].name)
      this.tasks.splice(0, 1)
    }
    if (this.tasks.length > 0) {
      // Start next spinner if there are tasks left
      this.showList()
    }
  }
  info (message) {
    if (this.tasks.length > 0) {
      this.spinner.info(message || this.tasks[0].name)
      this.tasks.splice(0, 1)
    }
    if (this.tasks.length > 0) {
      // Start next spinner if there are tasks left
      this.showList()
    }
  }
  add (task) {
    if (Array.isArray(task)) {
      task.forEach(taskItem => {
        this.tasks.push(makeTask(taskItem))
      })
    } else {
      this.tasks.push(makeTask(task))
    }
    if (this.spinner.stop) {
      // Hide old spinner if it exists
      this.spinner.stop()
    }
    // Show task
    this.showList()
  }
  fail (message) {
    this.spinner.fail(message || this.tasks[0].name)
  }
  complete (message) {
    Array.from(Array(this.tasks.length)).forEach(() => {
      this.next()
    })
    if (message) {
      console.log(message)
    }
  }
}

function makeTask (task, running) {
  if (typeof task === 'string') {
    task = { name: task }
  }
  if (!task.status) {
    task.status = running ? 'running' : 'pending'
  }
  return task
}
