type takePut = (agu: any) => void

type channelType = () => { put: takePut, take: takePut }

const channel: channelType = () => {
  let taker

  const take: takePut = (agu: any) => {
    taker = agu
  }

  const put : takePut = (agu: any) => {
    if (taker) {
      const nowTaker = taker
      taker = null
      nowTaker(agu)
    }
  }

  return {
    put,
    take
  }
}

const livingChan = channel()

const take = (): { type: string } => {
  return {
    type: 'take'
  }
}

function* mainSaga (): IterableIterator<any> {
  const action = yield take()
}

const task = (iterator: () => IterableIterator<any>): void => {
  const iterVariable = iterator()

  function next(args) {
    const result = iterVariable.next(args)
    if (!result.done) {
      const effect = result.value
      if (effect.type === 'take') {
        runTakeEffect(next)
      }
    }
  }
}

function runTakeEffect(next: (args?: any) => void) {
  livingChan.take(input => {
    next(input)
  });
}



let count = 0

function test () {
  const action =`action${count++}`
  livingChan.put(action)
}