import { NextFunction, Request, RequestHandler, Response } from 'express'

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
      return (req, res, next) => {
            return Promise.resolve(fn(req, res, next)).catch(next)
      }
}
