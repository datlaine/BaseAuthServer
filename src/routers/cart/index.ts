import { Router } from 'express'
import CartController from '~/controllers/cart.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const cartRouter = Router()

cartRouter.use(authentication)
cartRouter.post('/add-cart', asyncHandler(CartController.addcart))
cartRouter.get('/cart-get-count-product', asyncHandler(CartController.getCountProductCart))
cartRouter.get('/cart-get-my-cart', asyncHandler(CartController.getMyCart))

export default cartRouter
