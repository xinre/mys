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


function test () {
  
}