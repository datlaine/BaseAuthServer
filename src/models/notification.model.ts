import { Document, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'notifications'

interface Notification {
      notification_user_id: Types.ObjectId
      notification_count: number
      notifications_message: [
            {
                  notification_attribute: NotificationAttribute
                  notification_creation_time: Date
            }
      ]
}

export interface NotificationSystem {
      notification_type: 'SYSTEM'
      notification_content: string
}

// interface NotificationCommon extends NotificationSystem {}

export type NotificationProduct = {
      notification_type: 'PRODUCT'
      product_id: Types.ObjectId
      notification_content: string
}

export type NotificationShop = {
      notification_type: 'SHOP'
      order_id: Types.ObjectId
      order_product_id: Types.ObjectId
      notification_content: string
      user_buy_id: Types.ObjectId
}

export type NotificationAdmin = {
      notification_type: 'ADMIN'
      notification_content: string
      notification_sender: Types.ObjectId
}
// export type NotificationAdmin = NotificationCommon
type NotificationAttribute = NotificationSystem | NotificationProduct | NotificationAdmin | NotificationShop

export interface NotificationMessage {
      notification_attribute: NotificationAttribute
}
const notificationMessageSchema = new Schema({
      notification_attribute: { type: Schema.Types.Mixed, require: true },
      notification_creation_time: { type: Date, default: Date.now, require: true }
})

type NotificationDoc = Notification & Document

export const notificationSchema = new Schema<NotificationDoc>({
      notification_user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
      },
      notification_count: { type: Number, default: 0, required: true },
      notifications_message: [notificationMessageSchema]
})

export const notificationModel = model<NotificationDoc>(DOCUMENT_NAME, notificationSchema)
