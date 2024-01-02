import { NextFunction, Request, Response } from 'express'
import { CREATE } from '~/Core/response.success'
import AuthService from '~/services/auth.service'

class AuthController {
      static async register(req: Request, res: Response, next: NextFunction) {
            // return res.json(await AuthService.register(req, res))
            return new CREATE({ code: 200, reasonCode: 'CREATE', metadata: await AuthService.register(req, res) }).send(
                  res
            )
      }

      static logout = (req: Request, res: Response, next: NextFunction) => {
            return res.json('Logout Controller')
      }

      static login = (req: Request, res: Response, next: NextFunction) => {
            return res.json('Register Controller')
      }
}

export default AuthController
