import { Types } from 'mongoose'
import { IRequestCustom } from '~/middlewares/authentication'
import { NotificationMessage, notificationModel } from '~/models/notification.model'
import { orderModel } from '~/models/order.model'
import { shopModel } from '~/models/shop.model'
import userModel from '~/models/user.model'
import OrderRepository from '~/repositories/order.repo'

class NotificationService {
      static async getMeNotification(req: IRequestCustom) {
            const { user } = req
            const query = { notification_user_id: new Types.ObjectId(user?._id) }
            const notifications = await notificationModel.findOne(query).sort({ 'notifications_message.notification_creation_time': -1 })
            // const array: NotificationMessage[] = []
            // notifications?.notifications_message.map(async (n) => {
            //       if (n.notification_attribute.notification_type === 'PRODUCT') {
            //             console.log({ _id: n.notification_attribute.product_id })
            //             const query = { 'order_products._id': n.notification_attribute.product_id }
            //             const select = { 'order_products.$': 1 }
            //             const product = await orderModel.findOne(query, select)
            //       }
            // })
            // console.log({ user: user?._id, notifications })
            return { notifications }
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
