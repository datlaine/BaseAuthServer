import { NextFunction, Response } from 'express'
import { OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import ProductService from '~/services/product.service'

class ProductController {
      static async uploadProductThumb(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.uploadProductThumb(req) }).send(res)
      }

      static async uploadProductFull(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.uploadProductFull(req) }).send(res)
      }

      static async getAllProduct(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.getAllProduct(req) }).send(res)
      }
      static async deleteProductThumb(req: IRequestCustom, res: Response, next: NextFunction) {
            new OK({ metadata: await ProductService.deleteProductThumb(req) }).send(res)
      }
}

export default ProductController
