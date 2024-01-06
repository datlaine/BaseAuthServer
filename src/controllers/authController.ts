import { NextFunction, Request, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import AuthService from '~/services/auth.service'

class AuthController {
      static async register(req: Request, res: Response, next: NextFunction) {
            // return res.json(await AuthService.register(req, res))
            new CREATE({ metadata: await AuthService.register(req, res) }).send(res)
      }

      static logout = (req: Request, res: Response, next: NextFunction) => {
            return res.json('Logout Controller')
      }

      static async login(req: IRequestCustom, res: Response, next: NextFunction) {
            const { user, keyStore, refresh_token = null } = req
            new OK({ metadata: await AuthService.login({ user, keyStore, refresh_token } as IRequestCustom, req, res) }).send(res)
      }
}

export default AuthController
