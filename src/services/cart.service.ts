import mongoose, { Schema } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { IRequestCustom } from '~/middlewares/authentication'
import { cartModel } from '~/models/cart.modal'

class CartService {
      static async addCart(req: IRequestCustom) {
            const { user } = req
            const { product_id, quantity, price } = req.body
            console.log({ a: 123, url: req.originalUrl, product_id, quantity, price })
            const cart_price = Number(price)
            const cart_quantity = Number(quantity)
            const addCart = await cartModel.findOneAndUpdate(
                  { _id: new mongoose.Types.ObjectId() },
                  {
                        $set: {
                              cart_product_id: product_id,
                              cart_user_id: user?._id,
                              cart_quantity,
                              cart_price
                        }
                  },
                  { new: true, upsert: true }
            )
            if (!addCart) throw new BadRequestError({ detail: 'Add cart faild' })

            return { cart: addCart }
      }

      static async getCountProductCart(req: IRequestCustom) {
            const { user } = req
            const countCart = await cartModel.find({ cart_user_id: new mongoose.Types.ObjectId(user?._id) })
            if (!countCart) throw new BadRequestError({ detail: 'Lỗi máy chủ' })
            // console.log({ countCart })
            return { count: countCart.length }
      }

      static async getMyCart(req: IRequestCustom) {
            const { user } = req
            const foundCart = await cartModel
                  .find({ cart_user_id: user?._id })
                  .populate('cart_product_id', { product_thumb_image: 1, product_price: 1, product_name: 1 })
            if (!foundCart) throw new BadRequestError({ detail: 'Lỗi máy chủ' })
            console.log({ foundCart })
            return { cart: foundCart }
      }
}

export default CartService
