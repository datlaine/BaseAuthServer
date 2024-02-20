import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import { IProduct } from '~/models/product.model'
import { shopModel } from '~/models/shop.model'
import { ProductBook, ProductFactory } from '~/services/product.factory'
import ProductService from '~/services/product.service'

class ProductController {
      static async createBaseProductId(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.createBaseProductId(req) }).send(res)
      }

      static async uploadProductThumb(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.uploadProductThumb(req) }).send(res)
      }

      static async uploadProductDescriptionImageOne(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.uploadProductDescriptionImageOne(req) }).send(res)
      }

      // static async updateProductThumb(req: IRequestCustom, res: Response, next: NextFunction) {
      //       new OK({ metadata: await ProductService.updateProductThumb(req) }).send(res)
      // }

      static async getProductShop(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getProductShop(req) }).send(res)
      }
      static async deleteProductThumb(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductThumb(req) }).send(res)
      }

      static async deleteProductDescriptionImageOne(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductDescriptionImageOne(req) }).send(res)
      }

      // static async uploadProductImageFull(req: IRequestCustom, res: Response, next: NextFunction) {
      //       new OK({ metadata: await ProductService.uploadProductImageFull(req) }).send(res)
      // }

      // static async updateProductImageFull(req: IRequestCustom, res: Response, next: NextFunction) {
      //       new OK({ metadata: await ProductService.updateProductImageFull(req) }).send(res)
      // }

      static async deleteProductImageFull(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductImageFull(req) }).send(res)
      }

      static async uploadProductBook(req: IRequestCustom, res: Response, next: NextFunction) {
            const user_id = req.user?._id
            const foundShop = await shopModel.findOne({ owner: user_id })
            const {
                  _id,
                  attribute,
                  // product_desc_image,
                  product_name,
                  product_price,
                  // product_thumb_image,
                  product_type
            }: IProduct & { _id: Types.ObjectId } = req.body
            const {
                  // product_thumb_image_url,
                  // product_thumb_image_public_id,
                  publishing,
                  author,
                  page_number,
                  description
                  // product_image_description
            } = req.body

            const product_is_bought = 0
            const product_quantity = 1000
            const product_state = true
            console.log({ _id })

            const book = new ProductBook({
                  _id,
                  product_name,
                  product_price,
                  product_is_bought,
                  product_quantity,
                  shop_id: foundShop?._id,
                  attribute: { publishing, author, description, page_number, product_id: _id },
                  product_type,
                  product_state
            })

            new OK({ metadata: await ProductFactory.createProduct(book) }).send(res)
      }

      static async getAllProduct(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getAllProduct(req) }).send(res)
      }

      static async getProductWithId(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getProductWithId(req) }).send(res)
      }

      static async protectProduct(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.protectProduct(req) }).send(res)
      }

      static async deleteProductWithId(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductWithId(req) }).send(res)
      }
}

export default ProductController
