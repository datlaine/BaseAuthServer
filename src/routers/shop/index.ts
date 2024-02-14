import { Router } from 'express'
import { upload } from '~/configs/cloundinary.config'
import ShopController from '~/controllers/shop.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const shopRouter = Router()

//receive -> user_id

shopRouter.use(authentication)
shopRouter.post('/register-shop', asyncHandler(ShopController.registerShop))
shopRouter.post('/upload-avatar-shop', upload.single('image'), asyncHandler(ShopController.uploadAvatarShop))
shopRouter.post('/delete-avatar-shop', asyncHandler(ShopController.deleteAvatarShop))
// shopRouter.get('/get-shop-name', asyncHandler(ShopController.getShopName))
shopRouter.get('/get-my-shop', asyncHandler(ShopController.getMyShop))
shopRouter.get('/get-product-my-shop', asyncHandler(ShopController.getProductMyShop))

export default shopRouter
