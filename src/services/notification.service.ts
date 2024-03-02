import { Types } from 'mongoose'
import { IRequestCustom } from '~/middlewares/authentication'
import { NotificationMessage, notificationModel } from '~/models/notification.model'
import { orderModel } from '~/models/order.model'
import { shopModel } from '~/models/shop.model'
import userModel from '~/models/user.model'
import NotificationRepository from '~/repositories/notification.repository'
import OrderRepository from '~/repositories/order.repo'

export type NotificationType = 'PRODUCT' | 'SYSTEM' | 'ADMIN' | 'SHOP' | 'COMMON'

class NotificationService {
      static async getMeNotification(req: IRequestCustom) {
            const { user } = req
            const page = Number(req.query.page)
            const { type } = req.query
            const limit = Number(req.query.limit)

            const result = await NotificationRepository.getNotificationPage({
                  user_id: new Types.ObjectId(user?._id),
                  limit,
                  page,
                  type: type as NotificationType
            })

            return { notifications: result }
      }

      static async getMeNotificationPage(req: IRequestCustom) {
            const page = Number(req.query.page)
            const limit = Number(req.query.limit)

            const { user } = req
            const result = await NotificationRepository.getNotificationPage({
                  user_id: new Types.ObjectId(user?._id),
                  limit,
                  page,
                  type: 'PRODUCT'
            })

            console.log({ result })
            return result
      }

      static async getMyShopNotifications(req: IRequestCustom) {
            const { user } = req
            const { product_id } = req.params
            //@ Tìm Shop
            // const queryShop = {owner: new Types.ObjectId(user?._id)}
            // const foundShopUser = await shopModel.findOne(queryShop)
            // const query = {_id: new Types.ObjectId(user?._id)}
            // const foundUser = await userModel.findOne(query)
            const result = await OrderRepository.getOrderWitId({ order_products_products_id: product_id })
            console.log({ result, product_id })

            return { myNotificationShop: { product_sell: result } }
      }
}

export default NotificationService
