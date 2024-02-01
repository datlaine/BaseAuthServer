import { Router } from 'express'
import { upload } from '~/configs/cloundinary.config'
import ProductController from '~/controllers/product.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'
import { ProductFactory } from '~/services/product.factory'

const productRouter = Router()
productRouter.use(authentication)
productRouter.post('/upload-product-thumb', upload.single('file'), asyncHandler(ProductController.uploadProductThumb))
productRouter.post('/upload-product-book', asyncHandler(ProductController.uploadProductBook))
productRouter.get('/shop-product-all', asyncHandler(ProductController.getAllProduct))
productRouter.post('/delete-product-thumb', asyncHandler(ProductController.deleteProductThumb))
productRouter.post('/delete-product-image-full', asyncHandler(ProductController.deleteProductImageFull))

productRouter.post('/upload-product-images-full', upload.array('files'), asyncHandler(ProductController.uploadProductImageFull))
export default productRouter
