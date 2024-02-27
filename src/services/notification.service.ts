import { Types } from 'mongoose'
import { IRequestCustom } from '~/middlewares/authentication'
import { notificationModel } from '~/models/notification.model'

class NotificationService {
      static async getMeNotification(req: IRequestCustom) {
            const { user } = req
            const query = { notification_user_id: new Types.ObjectId(user?._id) }
            const notifications = await notificationModel.findOne(query)
            console.log({ user: user?._id, notifications })
            return { notifications }
      }
}

export default NotificationService
