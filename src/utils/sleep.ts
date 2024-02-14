const sleep = (ms: number) => {
      return new Promise((res, rej) => {
            setTimeout(() => {
                  res(1)
            }, ms)
      })
}

export default sleep
