import { Router } from 'express'
import NotificationController from '~/controllers/notification.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const notificationRouter = Router()

notificationRouter.use(authentication)
notificationRouter.get('/get-my-notification', asyncHandler(NotificationController.getMeNotification))
notificationRouter.get('/get-my-shop-notifications/:product_id', asyncHandler(NotificationController.getMyShopNotifications))
notificationRouter.get('/get-my-notification-product', asyncHandler(NotificationController.getMeNotificationPage))
notificationRouter.post('/read-notification/:notification_id', asyncHandler(NotificationController.readNotification))
notificationRouter.post('/delete-notification/:notification_id', asyncHandler(NotificationController.deleteNotification))

export default notificationRouter
