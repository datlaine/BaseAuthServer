import { Response } from 'express'
import { reasonCode, statusCode } from './httpStatusCode'

interface IResponseError {
      message?: string
      code?: number
      detail?: string | null
}

export class ResponseError extends Error {
      code: number
      message: string
      detail: string | null
      constructor({ code = statusCode.INTERNAL_SERVER_ERROR, message = reasonCode.INTERNAL_SERVER_ERROR, detail = null }: IResponseError) {
            super(message)
            this.code = code
            this.message = message
            this.detail = detail
      }
}

export class BadRequestError extends ResponseError {
      constructor({ code = statusCode.BAD_REQUEST, message = reasonCode.BAD_GATEWAY, detail = null }: IResponseError) {
            super({ code, message, detail })
      }
}

export class AuthFailedError extends ResponseError {
      constructor({ code = statusCode.UNAUTHORIZED, message = reasonCode.UNAUTHORIZED, detail = null }: IResponseError) {
            super({ code, message, detail })
      }
}

export class ForbiddenError extends ResponseError {
      constructor({ code = statusCode.FORBIDDEN, message = reasonCode.FORBIDDEN, detail = null }: IResponseError) {
            super({ code, message, detail })
      }
}

export class NotFoundError extends ResponseError {
      constructor({ code = statusCode.NOT_FOUND, message = reasonCode.NOT_FOUND, detail = null }: IResponseError) {
            super({ code, message, detail })
      }
}
