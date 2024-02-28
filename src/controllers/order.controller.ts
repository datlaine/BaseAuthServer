import { NextFunction, Response } from 'express'
import { ResponseSuccess } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import OrderService from '~/services/order.service'

class OrderController {
      static async orderAddProduct(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await OrderService.orderAddProduct(req) }).send(res)
      }

      static async getMyOrder(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await OrderService.getMyOrder(req) }).send(res)
      }

      static async buyAgain(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await OrderService.buyAgain(req) }).send(res)
      }

      static async getOrderInfo(req: IRequestCustom, res: Response, next: NextFunction) {
            new ResponseSuccess({ metadata: await OrderService.getOrderInfo(req) }).send(res)
      }
}

export default OrderController
