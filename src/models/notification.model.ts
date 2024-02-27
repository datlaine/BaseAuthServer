import { Document, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'notifications'

type NotificationType = 'System' | 'Admin' | 'Product'

interface Notification {
      notification_user_id: Types.ObjectId
      notification_count: number
      notifications_message: [
            {
                  notification_type: NotificationType
                  notification_attribute: NotificationAttribute
                  notification_creation_time: Date
            }
      ]
}

export interface NotificationSystem {
      notification_content: string
}

interface NotificationCommon extends NotificationSystem {
      notification_sender: Types.ObjectId
}

type NotificationAttribute = NotificationSystem | NotificationProduct | NotificationAdmin
export type NotificationProduct = NotificationCommon & { product_id: Types.ObjectId }
export type NotificationAdmin = NotificationCommon

export interface NotificationMessage {
      notification_type: NotificationType
      notification_attribute: NotificationAttribute
}
const notificationMessageSchema = new Schema({
      notification_type: { type: String, enum: ['System', 'Admin', 'Product'], default: 'System' },
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
