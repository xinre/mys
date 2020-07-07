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
      console.log(agu)
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
  console.log(action, '000')
}

const task = (iterator: () => IterableIterator<any>): void => {
  const iterVariable = iterator()

  function next(args?:any): void {
    const result = iterVariable.next(args)
    console.log(args, result, 'pppp')
    if (!result.done) {
      const effect = result.value
      if (effect.type === 'take') {
        runTakeEffect(next)
      }
    }
  }
  next()
}

function runTakeEffect(next: (args?: any) => void) {
  livingChan.take(input => {
    next(input)
  })
}

task(mainSaga)



let count = 0

function test () {
  const action =`action${count++}`
  livingChan.put(action)
}

test()