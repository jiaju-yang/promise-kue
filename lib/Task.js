class Task {
  constructor (method, args) {
    this.execution = () => {
      return method(...args)
    }
  }
}

module.exports = Task
