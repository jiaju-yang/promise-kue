const EventEmitter = require('events')
class EventBus extends EventEmitter {
}

function createQueue (limit, max) {
  let active = 0
  const bus = new EventBus()
  const queue = []
  const results = {}

  bus.push = function (taskId, tasks) {
    if (!Array.isArray(tasks)) {
      throw new Error('What is this?')
    }
    if (queue.length + tasks.length > max) {
      throw new Error('I am overloaded.')
    }
    results[taskId] = {
      taskCount: tasks.length,
      executed: []
    }
    tasks.forEach(task => {
      const waitingTask = {
        id: taskId,
        execution: function () {
          return task.method(...task.args)
        }
      }
      queue.push(waitingTask)
    })
    next()
  }

  function next () {
    if (active >= limit || !queue.length) {
      return
    }
    const task = queue.shift()
    active++
    task.execution()
      .then(result => {
        const {taskCount, executed} = results[task.id]
        executed.push(result)
        if (taskCount === executed.length) {
          bus.emit('sameIdTasksFinished', task.id)
        }
        active--
        bus.emit('taskFinished')
      })
    next()
  }

  bus.on('sameIdTasksFinished', id => {
    const taskResults = results[id]
    delete results[id]
    bus.emit(id, taskResults.executed)
  })

  bus.on('taskFinished', () => {
    next()
  })

  return bus
}

module.exports = {createQueue: createQueue}
