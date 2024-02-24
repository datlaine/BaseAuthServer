import { Router } from 'express'
import CartController from '~/controllers/cart.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const cartRouter = Router()

cartRouter.use(authentication)
cartRouter.post('/add-cart', asyncHandler(CartController.addcart))
cartRouter.get('/cart-get-count-product', asyncHandler(CartController.getCountProductCart))
cartRouter.get('/cart-get-my-cart', asyncHandler(CartController.getMyCart))
cartRouter.post('/cart-change-quantity', asyncHandler(CartController.changeQuantityProductCart))
cartRouter.post('/cart-change-select-all', asyncHandler(CartController.selectAllCart))
cartRouter.post('/cart-change-select-one', asyncHandler(CartController.selectOneCart))
cartRouter.get('/cart-pay', asyncHandler(CartController.calculatorPrice))
cartRouter.delete('/cart-delete/:product_id', asyncHandler(CartController.deleteCart))
cartRouter.post('/cart-update-address-cart', asyncHandler(CartController.updateAddressCart))

export default cartRouter
