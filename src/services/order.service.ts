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
            const update = { $push: { order_products: { $each: products } } }
            const option = { new: true, upsert: true, multi: true }
            const updateOrder = await orderModel.findOneAndUpdate(query, update, option)

            const productId = products.map((product) => product.product_id._id)

            const queryCart = { cart_user_id: new Types.ObjectId(user?._id) }
            const updateCart = { $pull: { cart_products: { product_id: { $in: [productId] } } }, $inc: { cart_count_product: -1 } }
            const optionCart = { new: true, upsert: true, multi: true }

            const a = await cartModel.findOneAndUpdate(queryCart, updateCart, optionCart)
            for (let index = 0; index < products.length; index++) {
                  await productModel.findOneAndUpdate(
                        { _id: productId[index] },
                        { $inc: { product_available: -products[index].quantity, product_is_bought: products[index].quantity } },
                        { new: true, upsert: true }
                  )
            }

            console.log({ updateOrder, products: products[0], _id: user?._id, a: JSON.stringify(a), productId })
            return 1
      }
}

export default OrderService
