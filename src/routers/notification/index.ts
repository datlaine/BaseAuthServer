import { Router } from 'express'
import NotificationController from '~/controllers/notification.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const notificationRouter = Router()

notificationRouter.use(authentication)
notificationRouter.get('/get-my-notification', asyncHandler(NotificationController.getMeNotification))

export default notificationRouter
