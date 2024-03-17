import { NextFunction, Response } from 'express'
import { ObjectId, Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { OK } from '~/Core/response.success'
import { product_default_vote } from '~/constant/product.constant'
import { IRequestCustom } from '~/middlewares/authentication'
import productModel, { IProduct, IProductBook, IProductFoodDoc } from '~/models/product.model'
import { productShopModel, shopModel } from '~/models/shop.model'
import { ProductBook, ProductFactory, ProductFood } from '~/services/product.factory'
import ProductService from '~/services/product.service'
import { shopProductUnique } from '~/utils/shop.utils'

class ProductController {
      static async searchQuery(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.searchQuery(req) }).send(res)
      }

      static async seachNameProduct(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.seachNameProduct(req) }).send(res)
      }

      static async createBaseProductId(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.createBaseProductId(req) }).send(res)
      }

      static async uploadProductThumb(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.uploadProductThumb(req) }).send(res)
      }

      static async uploadProductDescriptionImageOne(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.uploadProductDescriptionImageOne(req) }).send(res)
      }

      static async getProductShop(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getProductShop(req) }).send(res)
      }
      static async deleteProductThumb(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductThumb(req) }).send(res)
      }

      static async deleteProductDescriptionImageOne(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductDescriptionImageOne(req) }).send(res)
      }

      static async deleteProductImageFull(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductImageFull(req) }).send(res)
      }

      static async uploadProductBook(
            req: IRequestCustom<{
                  uploadProduct: IProduct
                  product_id: string
                  product_attribute: IProductBook
                  mode: 'UPLOAD' | 'UPDATE'
            }>,
            res: Response,
            next: NextFunction
      ) {
            const user_id = req.user?._id
            const foundShop = await shopModel.findOne({ owner: user_id })
            console.log({ body: req.body })

            const { product_name, product_price, product_type, product_available } = req.body.uploadProduct

            const { product_id, mode } = req.body

            const { author, type, description, page_number, publishing } = req.body.product_attribute

            // const product_is_bought = product_is_bought || 0
            // const product_is_bought = product_is_bought || 0
            const product_state = true
            const product_votes = product_default_vote
            const product = await productModel.findOne({ _id: new Types.ObjectId(product_id) }).lean()
            if (!product?.product_thumb_image.secure_url || product.product_desc_image.length === 0) {
                  throw new BadRequestError({ detail: 'Quá trình upload hình ảnh xảy ra lỗi, vui lòng chọn lại' })
            }
            const book = new ProductBook({
                  _id: new Types.ObjectId(product_id),
                  product_name,
                  product_available,
                  product_votes,
                  product_price,
                  totalComment: 0,
                  product_is_bought: product?.product_is_bought || 0,
                  shop_id: foundShop?._id,
                  product_type,
                  product_state,
                  mode,
                  attribute: { publishing, author, description, page_number, product_id: new Types.ObjectId(product_id), type }
            })

            new OK({ metadata: await ProductFactory.createProduct(book) }).send(res)
      }

      static async uploadProductFood(
            req: IRequestCustom<{
                  uploadProduct: IProduct
                  product_id: string
                  product_attribute: IProductBook | IProductFoodDoc
                  mode: 'UPLOAD' | 'UPDATE'
            }>,
            res: Response,
            next: NextFunction
      ) {
            console.log({ body: req.body })
            const user_id = req.user?._id
            const foundShop = await shopModel.findOne({ owner: user_id })

            const { product_name, product_price, product_type, product_available } = req.body.uploadProduct

            const { product_id, mode } = req.body

            const { product_food_Manufacturers_Name, description, product_food_origin, type, product_food_unit } = req.body
                  .product_attribute as IProductFoodDoc

            // const product_is_bought = product_is_bought || 0
            const product_state = true
            const product_votes = product_default_vote
            const product = await productModel.findOne({ _id: new Types.ObjectId(product_id) }).lean()
            if (!product?.product_thumb_image.secure_url || product.product_desc_image.length === 0) {
                  throw new BadRequestError({ detail: 'Quá trình upload hình ảnh xảy ra lỗi, vui lòng chọn lại' })
            }
            const food = new ProductFood({
                  _id: new Types.ObjectId(product_id),
                  product_name,
                  product_available,
                  product_votes,
                  product_price,
                  totalComment: 0,
                  product_is_bought: product?.product_is_bought || 0,
                  shop_id: foundShop?._id,
                  product_type,
                  product_state,
                  mode,
                  attribute: {
                        description,
                        product_food_Manufacturers_Name,
                        product_food_origin,
                        type,
                        product_food_unit,
                        product_id: new Types.ObjectId(product_id)
                  } as unknown as IProductFoodDoc
            })

            new OK({ metadata: await ProductFactory.createProduct(food) }).send(res)
      }

      static async getAllProduct(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getAllProduct(req) }).send(res)
      }

      static async getAllProductCare(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getAllProductCare(req) }).send(res)
      }

      static async getProductSimilar(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getProductSimilar(req) }).send(res)
      }

      static async getProductBestBought(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getProductBestBought(req) }).send(res)
      }

      static async getProductBookAllType(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getProductBookAllType(req) }).send(res)
      }

      static async getProductFoodAllType(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getProductFoodAllType(req) }).send(res)
      }

      static async getAllProductWithType(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getAllProductWithType(req) }).send(res)
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

      static async getProductFilter(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getProductFilter(req) }).send(res)
      }
}

export default ProductController
