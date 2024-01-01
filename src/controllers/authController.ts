import { NextFunction, Request, Response } from 'express'

class AuthController {
      static login = (req: Request, res: Response, next: NextFunction) => {
            return res.json('Login Controller')
      }

      static logout = (req: Request, res: Response, next: NextFunction) => {
            return res.json('Logout Controller')
      }

      static register = (req: Request, res: Response, next: NextFunction) => {
            return res.json('Register Controller')
      }
}

export default AuthController
