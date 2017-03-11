const promiseKue = require('..')

function randomGenerator () {
  return (new Date()).getMilliseconds() * 1000 + Math.floor(Math.random() * 1000)
}

function asynchronousFunc (millisecond) {
  return new Promise((resolve) => {
    console.log(millisecond)
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 100))
    }, millisecond)
  })
}

const queue = promiseKue.createQueue(3, 1000)

const id1 = randomGenerator()
const tasks1 = [
  {method: asynchronousFunc, args: [1000]},
  {method: asynchronousFunc, args: [1000]},
  {method: asynchronousFunc, args: [2000]},
  {method: asynchronousFunc, args: [2000]},
  {method: asynchronousFunc, args: [3000]},
  {method: asynchronousFunc, args: [3000]},
  {method: asynchronousFunc, args: [3000]}
]

const id2 = randomGenerator()
const tasks2 = [
  {method: asynchronousFunc, args: [5000]},
  {method: asynchronousFunc, args: [5000]},
  {method: asynchronousFunc, args: [6000]},
  {method: asynchronousFunc, args: [6000]},
  {method: asynchronousFunc, args: [4000]},
  {method: asynchronousFunc, args: [4000]},
  {method: asynchronousFunc, args: [4000]}
]

queue.on(id1, result => {
  console.log(result)
})

queue.on(id2, result => {
  console.log(result)
})

queue.push(id1, tasks1)
queue.push(id2, tasks2)
