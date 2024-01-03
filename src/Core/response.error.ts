import { Response } from 'express'

interface IResponseError {
      message: string
      code: number
      reasonCode: string
}

class ResponseError extends Error {
      constructor({ code = 500, reasonCode = 'Error', message = 'Lỗi Server' }: IResponseError) {
            super(message)
      }
      send(res: Response) {
            return res.json(this)
      }
}

class BadRequest extends ResponseError {
      constructor({ code = 500, reasonCode = 'Error', message = 'Lỗi Server' }: IResponseError) {
            super({ code, reasonCode, message })
      }
      send(res: Response) {
            return super.send(res)
      }
}
