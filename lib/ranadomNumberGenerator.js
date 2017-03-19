module.exports = function () {
  let currentNumber = 0
  return () => {
    if (currentNumber > Number.MAX_SAFE_INTEGER) {
      currentNumber = 0
    }
    return currentNumber++
  }
}
