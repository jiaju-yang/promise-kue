# promise-kue
If you wanna limit promise concurrency, the library could help you.

## Introduction
Sometimes we have a lot of promises to execute. If we run them at the same time, resource would be used up. So we need to limit number of running promises. 

## Installation
``$ npm install promise-kue``

## Usage
First create a job queue with two parameters: ``limit`` and ``max``. ``limit`` is the number of concurrency promise. ``max`` is the max number of tasks waiting in queue. And ``max`` would be default value ``2000`` if you don't pass it:

```javascript
const {createQueue, Task} = require('promise-kue')

const queue = createQueue(5, 1000)
```

Then you could write a method wraping ``Promise``. This is used for delaying execution:

```javascript
function asynchronousFunc (arg1, arg2, ...) {
	return new Promise((resolve, reject) => {
		//...
	}
}
```

Construct tasks to execute:

```javascript
const tasks1 = [
  new Task(asynchronousFunc, [arg1, arg2...]),
  new Task(asynchronousFunc, [arg1, arg2...]),
  //...
]

const tasks2 = [
	new Task(asynchronousFunc, [arg1, arg2...]),
  new Task(asynchronousFunc, [arg1, arg2...]),
  //...
]
```

The last step is just pushing tasks to queue and waiting for results.

```javascript
queue.on(queue.push(tasks1), (err, result) => {
  //...
})
//Using head method to push tasks to the head of queue.
queue.on(queue.head(tasks1), (err, result) => {
  //...
})
//Could also push only one task to queue.
queue.on(queue.head(new Task(asynchronousFunc, [arg1, arg2...])), (err, result) => {
  //...
})
```

If queue is not overloaded, ``result`` would have two properties: ``success`` and ``failure``. They are both arrays containing successful results and fail results. But order is not guaranteed.

Any suggestions is welcome.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.