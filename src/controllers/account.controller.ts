import { NextFunction, Response } from 'express'
import { OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import AccountService from '~/services/account.service'

class AccountController {
      static async getMe(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.getMe(req) }).send(res)
      }

      static async updateAvatar(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.updateAvatar(req) }).send(res)
      }

      static async updateEmail() {}

      static async updatePassword(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.updatePassword(req) }).send(res)
      }

      static async updateInfo(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.updateInfo(req) }).send(res)
      }

      static async getAllAvatar(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.getAllAvatar(req) }).send(res)
      }

      static async deleteAvatarUsed(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.deleteAvatarUsed(req) }).send(res)
      }

      static async deleteAvatar(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.deleteAvatar(req) }).send(res)
      }
}

export default AccountController
