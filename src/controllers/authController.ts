import { NextFunction, Request, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import AuthService from '~/services/auth.service'

class AuthController {
      static async register(req: Request, res: Response, next: NextFunction) {
            // return res.json(await AuthService.register(req, res))
            new CREATE({ metadata: await AuthService.register(req, res) }).send(res)
      }

      static async logout(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AuthService.logout(req, res) }).send(res)
      }

      static async login(req: IRequestCustom, res: Response, next: NextFunction) {
            // const { user, keyStore, refresh_token = null } = req
            new OK({ metadata: await AuthService.login(req, res) }).send(res)
      }

      static async refresh_token(req: IRequestCustom, res: Response) {
            new OK({ metadata: await AuthService.refresh_token(req, res) }).send(res)
      }

      static async getMe(req: Request, res: Response) {
            const { _id } = req.body
            const cook = req.cookies['refresh_token']
            console.log('cookies', cook)
            return res.json({ _id })
      }
}

export default AuthController
