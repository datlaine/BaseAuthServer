import { NextFunction, Response } from 'express'
import { OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import AccountService from '~/services/account.service'

class AccountController {
      static async getMe(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.getMe(req) }).send(res)
      }

      static async updateAvatar() {}

      static async updateEmail() {}

      static async updatePassword() {}

      static async updateInfo(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.updateInfo(req) }).send(res)
      }
}

export default AccountController
