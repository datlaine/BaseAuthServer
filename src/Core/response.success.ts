import { Response } from 'express'

interface IResponseSuccess {
      code: number
      reasonCode: string
      metadata: any
}

class ResponseSuccess {
      code: number
      reasonCode: string
      metadata: any

      constructor({ code = 200, reasonCode = 'Success', metadata = {} }: IResponseSuccess) {
            ;(this.code = code), (this.reasonCode = reasonCode)
            this.metadata = metadata
      }

      send(res: Response) {
            return res.json(this)
      }
}

class CREATE extends ResponseSuccess {
      constructor({ code = 200, reasonCode = 'Success', metadata = {} }: IResponseSuccess) {
            super({ code, reasonCode, metadata })
      }

      send(res: Response) {
            return super.send(res)
      }
}

export { CREATE, ResponseSuccess, IResponseSuccess }
