import { Response } from 'express'
import { reasonCode, statusCode } from './httpStatusCode'

interface IResponseSuccess {
      code?: number
      message?: string
      metadata?: any
}

class ResponseSuccess {
      code: number
      message: string
      metadata: any

      constructor({ code = 200, message = 'Success', metadata = {} }: IResponseSuccess) {
            ;(this.code = code), (this.message = message)
            this.metadata = metadata
      }

      send(res: Response) {
            return res.json(this)
      }
}

class CREATE extends ResponseSuccess {
      constructor({ code = statusCode.CREATED, message = reasonCode.CREATED, metadata = {} }: IResponseSuccess) {
            super({ code, message, metadata })
      }

      send(res: Response) {
            return super.send(res)
      }
}

class OK extends ResponseSuccess {
      constructor({ code = statusCode.OK, message = reasonCode.OK, metadata = {} }: IResponseSuccess) {
            super({ code, message, metadata })
      }

      send(res: Response) {
            return super.send(res)
      }
}

export { CREATE, ResponseSuccess, OK, IResponseSuccess }
