/*

Copyright 2016 David Braun
soon to be released as open source

*/

'use strict'

const isPromise = require('is-promise')
const F = require('fairmont')
const stream = require('stream')

const Iterator = function* (value) {
  if (F.isFunction(value)) {
    while (true) {
      yield value()
    }
  } else {
    yield value
  }
}

const iteratorToStream = (iterator) =>
  new stream.Readable({
    read () {
      const push = (next) =>
        this.push(next.done ? null : next.value)

      const next = iterator.next()

      if (isPromise(next)) {
        next.then(push)
      } else {
        push(next)
      }
    }
  })

const intervalAsyncIterator = (delay) => {
  let lastOutput = Date.now()

  return Reactor((enqueue) =>
    () =>
      setTimeout(() => {
        lastOutput = Date.now()

        enqueue({
          done: false,
          value: lastOutput
        })
      }, delay - (Date.now() - lastOutput))
  )
}

const undoableReactor = (reactor) => {
  let input = []
  let output = []

  const process = () => {
    if (input.length > 0 && output.length > 0) {
      output.shift()(input.shift())
      setImmediate(process)
    }
  }

  const undoable = F.reactor(() =>
    new Promise((resolve) => {
      output.push(resolve)

      reactor.next().then((result) => {
        input.push(result)
        process()
      })

      process()
    })
  )

  undoable.undo = (result) => {
    input.unshift(result)
    process()
  }

  return undoable
}

const partitionOnTrigger = (trigger) =>
  (input) =>
    Reactor((enqueue) => {
      const undoableInput = undoableReactor(input)
      let inputDone = false

      const partitionReactor = () =>
        Reactor((partitionEnqueue) => {
          let triggered = false

          const pullInput = () => {
            if (!triggered) {
              undoableInput.next().then((result) => {
                if (triggered) {
                  undoableInput.undo(result)
                  inputDone = false
                } else {
                  partitionEnqueue(result)
                  inputDone = result.done
                }
              })
            }
          }

          trigger.next().then(() => {
            triggered = true

            if (inputDone) {
              enqueue({done: true})
            } else {
              partitionEnqueue({done: true})
              newPartition()
            }
          })

          return pullInput
        })

      const newPartition = () => {
        enqueue({
          done: false,
          value: partitionReactor()
        })
      }

      newPartition()
    })

const pullConcurrently = (iterator) =>
  Reactor((enqueue) => {
    const pullInput = () => {
      const next = iterator.next()

      if (next.done) {
        enqueue(next)
      } else {
        enqueue(Promise.resolve(next.value).then((value) => ({
          done: false,
          value
        })))

        setImmediate(pullInput)
      }
    }

    pullInput()
  })

const pullConcurrentlyWithThrottle = F.curry((count, iterator) =>
  Reactor((enqueue) => {
    let throttled = false
    let pending = 0
    let fulfilled = 0

    const pullInput = () => {
      setImmediate(() => {
        if (fulfilled < count) {
          const next = iterator.next()

          if (next.done) {
            enqueue(next)
          } else {
            pending++

            next.value
              .then((value) => {
                pending--
                fulfilled++

                enqueue({
                  done: false,
                  value
                })

                if (throttled) {
                  pullInput()
                }
              })
              .catch((reason) => {
                if (!throttled) {
                  throttled = true
                  console.warn(`Caught error, throttling to ${pending} simultaneous transactions.`)
                }
              })

            if (!throttled) {
              pullInput()
            }
          }
        } else {
          enqueue({done: true})
        }
      })
    }

    pullInput()
  })
)

const pullIteratorSerially = (iterator) =>
  Reactor((enqueue) => {
    let pending = 0

    return () => {
      const next = iterator.next()

      if (next.done) {
        if (pending === 0) {
          enqueue(next)
        }
      } else {
        pending++

        next.value.then((value) => {
          pending--

          enqueue({
            done: false,
            value
          })
        })
      }
    }
  })

const pullReactorSerially = (reactor) =>
  Reactor((enqueue) => {
    let pending = 0

    return () => {
      reactor.next().then((next) => {
        if (next.done) {
          if (pending === 0) {
            enqueue(next)
          }
        } else {
          pending++

          next.value.then((value) => {
            pending--

            enqueue({
              done: false,
              value
            })
          })
        }
      })
    }
  })

const Reactor = (func) => {
  let input = []
  let output = []

  const processQueues = () => {
    if (input.length > 0 && output.length > 0) {
      output.shift()(input[0].done
        ? input[0]
        : input.shift()
      )

      setImmediate(processQueues)
    }
  }

  const enqueue = (result) => {
    input.push(result)
    processQueues()
  }

  const onNext = func(enqueue)

  return F.reactor(() =>
    new Promise((resolve) => {
      output.push(resolve)

      if (F.isFunction(onNext)) {
        onNext()
      }

      processQueues()
    })
  )
}

const streamToPromise = (stream) =>
  new Promise((resolve, reject) => {
    stream.once('end', resolve)
    stream.once('error', reject)
  })

// Fairmont's takeN isn't curried and grabs one more result than necessary from
// the iterator before terminating.
const takeN = F.curry(function* (n, iterator) {
  for (let index = 0; index < n; index++) {
    const next = iterator.next()

    if (next.done) {
      break
    } else {
      yield next.value
    }
  }
})

const takeNFromReactor = F.curry((n, reactor) =>
  Reactor((enqueue) => {
    let count = 0

    return () => {
      if (count < n) {
        reactor.next().then((result) => {
          count++
          enqueue(result)
        })
      } else {
        enqueue({done: true})
      }
    }
  })
)

const trace = F.curry((label, value) => {
  console.log(label, value)
  return value
})

module.exports = {
  Iterator,
  iteratorToStream,
  intervalAsyncIterator,
  partitionOnTrigger,
  pullConcurrently,
  pullConcurrentlyWithThrottle,
  pullIteratorSerially,
  pullReactorSerially,
  streamToPromise,
  takeN,
  takeNFromReactor,
  trace
}
