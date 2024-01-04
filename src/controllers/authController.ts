import { NextFunction, Request, Response } from 'express'
import { CREATE } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import AuthService from '~/services/auth.service'

class AuthController {
      static async register(req: Request, res: Response, next: NextFunction) {
            // return res.json(await AuthService.register(req, res))
            new CREATE({ code: 200, reasonCode: 'CREATE', metadata: await AuthService.register(req, res) }).send(res)
      }

      static logout = (req: Request, res: Response, next: NextFunction) => {
            return res.json('Logout Controller')
      }

      static login = (req: IRequestCustom, res: Response, next: NextFunction) => {
            const { user, keyStore, refresh_token = null } = req

            return res.json({ user, keyStore, refresh_token })
      }
}

export default AuthController
