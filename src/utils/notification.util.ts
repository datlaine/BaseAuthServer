import { Types } from 'mongoose'
import { NotificationMessage, NotificationSystem } from '~/models/notification.model'

export const renderNotificationSystem = (message: string) => {
      const notification_attribute: NotificationSystem = {
            notification_type: 'SYSTEM',
            notification_content: message
      }
      return { notification_attribute }
}

export const renderNotificationProduct = ({
      message,
      order_id,
      product_name,
      product_quantity
}: {
      message: string
      order_id: Types.ObjectId
      product_name: string
      product_quantity: number
}) => {
      const notificationProduct: NotificationMessage = {
            notification_attribute: {
                  notification_type: 'PRODUCT',
                  product_name,
                  product_quantity,
                  notification_content: message,
                  order_id: new Types.ObjectId(order_id)
            }
      }
      return notificationProduct
}

export const renderNotificationShop = ({
      message,
      order_id,
      order_product_id,
      user_buy_id
}: {
      message: string
      order_id: Types.ObjectId
      order_product_id: Types.ObjectId
      user_buy_id: Types.ObjectId
}) => {
      const notificationProduct: NotificationMessage = {
            notification_attribute: {
                  notification_type: 'SHOP',
                  notification_content: message,
                  order_id: new Types.ObjectId(order_id),
                  order_product_id: new Types.ObjectId(order_product_id),
                  user_buy_id: new Types.ObjectId(user_buy_id)
            }
      }
      return notificationProduct
}
