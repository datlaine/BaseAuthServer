import { Router } from 'express'
import { upload } from '~/configs/cloundinary.config'
import ShopController from '~/controllers/shop.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const shopRouter = Router()

//receive -> user_id

shopRouter.get('/get-shop-id', asyncHandler(ShopController.getShopId))
shopRouter.get('/get-shop-has-product', asyncHandler(ShopController.foundShopHasProductType))
shopRouter.get('/get-shop-product', asyncHandler(ShopController.getShopInfoOfProduct))
shopRouter.get('/get-product-best-seller', asyncHandler(ShopController.getProductFilter))
shopRouter.get('/get-shop-admin', asyncHandler(ShopController.getShopAdmin))

shopRouter.use(authentication)
shopRouter.post('/register-shop', upload.single('file'), asyncHandler(ShopController.registerShop))
shopRouter.post('/upload-avatar-shop', upload.single('image'), asyncHandler(ShopController.uploadAvatarShop))
shopRouter.post('/delete-avatar-shop', asyncHandler(ShopController.deleteAvatarShop))
// shopRouter.get('/get-shop-name', asyncHandler(ShopController.getShopName))
shopRouter.get('/get-my-shop', asyncHandler(ShopController.getMyShop))
shopRouter.get('/get-product-my-shop', asyncHandler(ShopController.getProductMyShop))
shopRouter.get('/get-my-order-shop', asyncHandler(ShopController.getOrderMyShop))

export default shopRouter
