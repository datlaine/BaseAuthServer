import { NextFunction, Response } from 'express'
import { OK, ResponseSuccess } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import AccountService from '~/services/account.service'

class AccountController {
      static async getMeQuery(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.getMe(req) }).send(res)
      }

      static async getMe(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.getMe(req) }).send(res)
      }

      static async updateAvatar(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await AccountService.updateAvatar(req) }).send(res)
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

      static async addAddress(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await AccountService.addAddress(req) }).send(res)
      }

      static async setAddressDefault(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await AccountService.setAddressDefault(req) }).send(res)
      }

      static async deleteAddress(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await AccountService.deleteAddress(req) }).send(res)
      }

      static async securityPassword(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await AccountService.securityPassword(req) }).send(res)
      }

      static async updateEmail(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await AccountService.updateEmail(req) }).send(res)
      }

      static async updatePassword(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await AccountService.updatePassword(req) }).send(res)
      }
}

export default AccountController
