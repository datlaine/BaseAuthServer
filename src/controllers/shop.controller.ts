import { NextFunction, Response } from 'express'
import { OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import ShopService from '~/services/shop.service'

class ShopController {
      static async registerShop(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await ShopService.registerShop(req) }).send(res)
      }

      static async uploadAvatarShop(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await ShopService.UploadAvatarShop(req) }).send(res)
      }

      static async deleteAvatarShop(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await ShopService.deleteAvatarShop(req) }).send(res)
      }
      // static async getShopName(req: IRequestCustom, res: Response, next: NextFunction) {
      //       return new OK({ metadata: await ShopService.getShopName(req) }).send(res)
      // }
      static async getMyShop(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await ShopService.getMyShop(req) }).send(res)
      }

      static async getProductMyShop(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await ShopService.getProductMyShop(req) }).send(res)
      }
}

export default ShopController
