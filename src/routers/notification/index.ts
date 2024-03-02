import { Router } from 'express'
import NotificationController from '~/controllers/notification.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const notificationRouter = Router()

notificationRouter.use(authentication)
notificationRouter.get('/get-my-notification', asyncHandler(NotificationController.getMeNotification))
notificationRouter.get('/get-my-shop-notifications/:product_id', asyncHandler(NotificationController.getMyShopNotifications))
notificationRouter.get('/get-my-notification-product', asyncHandler(NotificationController.getMeNotificationPage))

export default notificationRouter
