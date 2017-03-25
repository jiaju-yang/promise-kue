const Task = require('./lib/Task')
const EventBus = require('./lib/EventBus')
const randomNumberGenerator = require('./lib/ranadomNumberGenerator')

function createQueue (limit, max = 2000) {
  const generate = randomNumberGenerator()
  let active = 0
  const bus = new EventBus()
  const queue = []
  const results = {}

  function push (task) {
    return addTask(Array.isArray(task) ? task : [task], queue.push)
  }

  function head (task) {
    return addTask(Array.isArray(task) ? task : [task], queue.unshift)
  }

  function addTask (tasks, fn) {
    const id = generate()
    checkTasksAllRight(tasks)
    setTimeout(() => {
      if (queue.length + tasks.length > max) {
        return sendError(id, new Error('I am overloaded.'))
      }
      results[id] = {
        taskCount: tasks.length,
        executed: {
          success: [],
          failure: []
        }
      }
      const queueFn = fn.bind(queue)
      tasks.forEach(task => {
        task.id = id
        queueFn(task)
      })
      next()
    }, 0)
    return id
  }

  function next () {
    if (active >= limit || !queue.length) {
      return
    }
    const task = queue.shift()
    active++
    task.execution()
      .then(result => {
        handleResult(task.id, result, results[task.id].executed.success)
      })
      .catch(err => {
        handleResult(task.id, err, results[task.id].executed.failure)
      })
    next()
  }

  function checkTasksAllRight (tasks) {
    for (let i = 0; i < tasks.length; i++) {
      if (!(tasks[i] instanceof Task)) {
        throw new Error(`I don't know what this is. But it's definitely not a task.`)
      }
    }
  }

  function handleResult (id, result, resultCollector) {
    const {taskCount, executed} = results[id]
    resultCollector.push(result)
    if (taskCount === executed.success.length + executed.failure.length) {
      sameIdTasksFinished(id)
    }
    active--
    next()
  }

  function sameIdTasksFinished (id) {
    const taskResults = results[id]
    delete results[id]
    bus.emit(id, null, taskResults.executed)
  }

  function sendError (id, err) {
    if (results[id]) {
      delete results[id]
    }
    bus.emit(id, err)
  }

  return {
    push: push,
    head: head,
    on: function (type, listener) {
      bus.once(type, listener)
    }
  }
}

module.exports = {createQueue: createQueue, Task: Task}
