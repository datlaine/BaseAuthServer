import { Types } from 'mongoose'
import { NotificationMessage, NotificationSystem } from '~/models/notification.model'

export const renderNotificationSystem = (message: string) => {
      const notification_attribute: NotificationSystem = {
            notification_content: message
      }
      return { notification_attribute }
}

export const renderNotificationProduct = ({
      message,
      sender_id,
      product_id
}: {
      message: string
      sender_id: Types.ObjectId
      product_id: Types.ObjectId
}) => {
      const notificationProduct: NotificationMessage = {
            notification_type: 'Product',
            notification_attribute: {
                  notification_content: message,
                  notification_sender: new Types.ObjectId(sender_id),
                  product_id: new Types.ObjectId(product_id)
            }
      }
      return notificationProduct
}
