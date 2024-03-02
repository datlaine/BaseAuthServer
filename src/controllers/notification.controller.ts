import { NextFunction, Response } from 'express'
import { ResponseSuccess } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import NotificationService from '~/services/notification.service'

class NotificationController {
      static async getMeNotification(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await NotificationService.getMeNotification(req) }).send(res)
      }
      static async getMyShopNotifications(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await NotificationService.getMyShopNotifications(req) }).send(res)
      }

      static async getMeNotificationPage(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await NotificationService.getMeNotificationPage(req) }).send(res)
      }
}

export default NotificationController
