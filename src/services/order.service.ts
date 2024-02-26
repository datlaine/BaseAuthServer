import { Types } from 'mongoose'
import { IRequestCustom } from '~/middlewares/authentication'
import { CartProduct, cartModel } from '~/models/cart.modal'
import { orderModel } from '~/models/order.model'
import productModel from '~/models/product.model'

class OrderService {
      static async orderAddProduct(req: IRequestCustom<{ products: CartProduct[] }>) {
            const { user } = req
            const { products } = req.body
            const query = { order_user_id: new Types.ObjectId(user?._id) }
            const update = { $push: { order_products: { products: products } } }
            const option = { new: true, upsert: true, multi: true }
            const updateOrder = await orderModel.findOneAndUpdate(query, update, option)

            const productId = products.map((product) => product.product_id._id)

            const queryCart = { cart_user_id: new Types.ObjectId(user?._id) }
            const updateCart = {
                  $pull: { cart_products: { product_id: { $in: productId } } },
                  $inc: { cart_count_product: -productId.length }
            }
            const optionCart = { new: true, upsert: true, multi: true }

            const a = await cartModel.findOneAndUpdate(queryCart, updateCart, optionCart)
            for (let index = 0; index < products.length; index++) {
                  await productModel.findOneAndUpdate(
                        { _id: productId[index] },
                        { $inc: { product_available: -products[index].quantity, product_is_bought: products[index].quantity } },
                        { new: true, upsert: true }
                  )
            }

            console.log({ updateOrder, products: products[0], _id: user?._id, a: JSON.stringify(updateOrder) })
            return 1
      }

      static async getMyOrder(req: IRequestCustom) {
            const { user } = req
            const query = { order_user_id: new Types.ObjectId(user?._id) }

            const myOrder = await orderModel.findOne(query).populate({
                  path: 'order_products.products.product_id',
                  select: { product_name: 1, product_thumb_image: 1, product_price: 1 }
            })

            return { order: myOrder }
      }
}

export default OrderService
