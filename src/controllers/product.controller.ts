import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import { IProduct } from '~/models/product.model'
import { ProductBook, ProductFactory } from '~/services/product.factory'
import ProductService from '~/services/product.service'

class ProductController {
      static async uploadProductThumb(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.uploadProductThumb(req) }).send(res)
      }

      static async getAllProduct(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getAllProduct(req) }).send(res)
      }
      static async deleteProductThumb(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductThumb(req) }).send(res)
      }

      static async uploadProductImageFull(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.uploadProductImageFull(req) }).send(res)
      }

      static async deleteProductImageFull(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductImageFull(req) }).send(res)
      }

      static async uploadProductBook(req: IRequestCustom, res: Response, next: NextFunction) {
            const {
                  _id,
                  attribute,
                  product_desc_image,
                  product_name,
                  product_price,
                  // product_thumb_image,
                  product_type
            }: IProduct & { _id: Types.ObjectId } = req.body
            const user_id = req.user?._id
            const { product_thumb_image_url, product_thumb_image_public_id, publishing, author, page_number, description } = req.body
            const book = new ProductBook({
                  _id,
                  product_name,
                  product_price,
                  product_thumb_image: {
                        public_id: product_thumb_image_public_id,
                        secure_url: product_thumb_image_url
                  },
                  product_desc_image,
                  user_id,
                  attribute: { publishing, author, description, page_number, product_id: _id },
                  product_type
            })

            new OK({ metadata: await ProductFactory.createProduct(book) }).send(res)
      }
}

export default ProductController
