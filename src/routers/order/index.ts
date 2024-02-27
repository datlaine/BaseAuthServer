import { Router } from 'express'
import OrderController from '~/controllers/order.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const orderRouter = Router()

orderRouter.use(authentication)
orderRouter.post('/order-payment-product', asyncHandler(OrderController.orderAddProduct))
orderRouter.get('/get-my-order', asyncHandler(OrderController.getMyOrder))
orderRouter.post('/buy-again', asyncHandler(OrderController.buyAgain))

export default orderRouter
