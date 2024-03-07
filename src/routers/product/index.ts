import { Router } from 'express'
import { upload } from '~/configs/cloundinary.config'
import ProductController from '~/controllers/product.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'
import { ProductFactory } from '~/services/product.factory'

const productRouter = Router()

productRouter.get('/get-all-product-category', asyncHandler(ProductController.getAllProductWithType))
productRouter.get('/get-all-product', asyncHandler(ProductController.getAllProduct))
productRouter.get('/get-product/:id', asyncHandler(ProductController.getProductWithId))
productRouter.get('/get-product/:id', asyncHandler(ProductController.getProductWithId))
productRouter.get('/get-product-filter', asyncHandler(ProductController.getProductFilter))

productRouter.use(authentication)
productRouter.get('/protect-product/:product_id', asyncHandler(ProductController.protectProduct))

productRouter.post('/create-base-product-id', asyncHandler(ProductController.createBaseProductId))
productRouter.post('/upload-product-thumb', upload.single('file'), asyncHandler(ProductController.uploadProductThumb))
// productRouter.post('/update-product-thumb', upload.single('file'), asyncHandler(ProductController.updateProductThumb))
productRouter.post(
      '/upload-product-description-image-one',
      upload.single('file'),
      asyncHandler(ProductController.uploadProductDescriptionImageOne)
)

productRouter.post(
      '/delete-product-description-image-one',
      upload.single('file'),
      asyncHandler(ProductController.deleteProductDescriptionImageOne)
)

productRouter.post('/upload-product-book', asyncHandler(ProductController.uploadProductBook))
productRouter.post('/upload-product-food', asyncHandler(ProductController.uploadProductFood))

productRouter.get('/shop-product-all', asyncHandler(ProductController.getProductShop))
productRouter.post('/delete-product-thumb', asyncHandler(ProductController.deleteProductThumb))
productRouter.post('/delete-product-image-full', asyncHandler(ProductController.deleteProductImageFull))
// productRouter.post('/upload-product-images-full', upload.array('files'), asyncHandler(ProductController.uploadProductImageFull))
// productRouter.post('/update-product-images-full', upload.array('files'), asyncHandler(ProductController.updateProductImageFull))

productRouter.delete('/delete-product/:product_id', asyncHandler(ProductController.deleteProductWithId))

export default productRouter
