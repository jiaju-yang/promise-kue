const {createQueue, Task} = require('..')

function asynchronousFunc (millisecond) {
  return new Promise((resolve, reject) => {
    console.log(millisecond)
    setTimeout(() => {
      if (millisecond === 5000) {
        return reject(Math.floor(Math.random() * 100))
      }
      resolve(Math.floor(Math.random() * 100))
    }, millisecond)
  })
}

const queue = createQueue(3, 1000)

const tasks1 = [
  // {method: asynchronousFunc, args: [1000]},
  new Task(asynchronousFunc, [1000]),
  new Task(asynchronousFunc, [1000]),
  new Task(asynchronousFunc, [2000]),
  new Task(asynchronousFunc, [2000]),
  new Task(asynchronousFunc, [3000]),
  new Task(asynchronousFunc, [3000]),
  new Task(asynchronousFunc, [3000])
]

const tasks2 = [
  new Task(asynchronousFunc, [5000]),
  new Task(asynchronousFunc, [5000]),
  new Task(asynchronousFunc, [6000]),
  new Task(asynchronousFunc, [6000]),
  new Task(asynchronousFunc, [4000]),
  new Task(asynchronousFunc, [4000]),
  new Task(asynchronousFunc, [4000])
]

queue.on(queue.push(tasks1), (err, result) => {
  console.log(err)
  console.log(result)
})

queue.on(queue.push(tasks2), (err, result) => {
  console.log(err)
  console.log(result)
})

queue.on(queue.head(new Task(asynchronousFunc, [500])), (err, result) => {
  console.log(err)
  console.log(result)
})

