import mongoose, { Schema, Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { IRequestCustom } from '~/middlewares/authentication'
import { CartProduct, cartModel } from '~/models/cart.modal'
import productModel from '~/models/product.model'
import userModel from '~/models/user.model'

type TModeChangeCartQuantity = 'INCREASE' | 'DECREASE' | 'INPUT'

class CartService {
      // static async addCart(req: IRequestCustom) {
      //       const { user } = req
      //       const { product_id, quantity, cart_product_price_origin } = req.body
      //       const cart_product_price_origin_number = Number(cart_product_price_origin)
      //       const cart_quantity = Number(quantity)
      //       const cart_product_price = cart_quantity * cart_product_price_origin
      //       const foundCart = await cartModel
      //             .findOne({ cart_product_id: product_id, cart_user_id: new Types.ObjectId(user?._id) })
      //             .populate('cart_product_id')

      //       if (foundCart) {
      //             console.log('found')
      //             const updateQuantity = foundCart.cart_quantity + cart_quantity
      //             const updatePrice = updateQuantity * foundCart.cart_product_price_origin
      //             const updateCart = await cartModel.findOneAndUpdate(
      //                   { cart_product_id: product_id },
      //                   {
      //                         $set: {
      //                               cart_quantity: updateQuantity,
      //                               cart_product_price: updatePrice
      //                         }
      //                   },
      //                   { new: true, upsert: true }
      //             )
      //             return { cart: updateCart }
      //       }
      //       console.log('not-found')

      //       const addCart = await cartModel.findOneAndUpdate(
      //             { cart_user_id: new Types.ObjectId(user?._id) },
      //             {
      //                   $set: {
      //                         cart_product_id: product_id,
      //                         cart_user_id: user?._id,
      //                         cart_quantity,
      //                         cart_product_price,
      //                         cart_product_price_origin: cart_product_price_origin_number
      //                   }
      //             },
      //             { new: true, upsert: true }
      //       )
      //       if (!addCart) throw new BadRequestError({ detail: 'Add cart faild' })

      //       return { cart: addCart }
      // }

      static async createCart({ user_id, product }: { user_id: string; product: CartProduct }) {
            const query = { cart_user_id: new Types.ObjectId(user_id) }
            const update = {
                  $addToSet: {
                        cart_products: product
                  },
                  $inc: { cart_count_product: 1 }
            }

            const option = { new: true, upsert: true }

            const userCart = await cartModel.findOneAndUpdate(query, update, option)
            return { cart: userCart }
      }

      static async addCart(req: IRequestCustom) {
            const { user } = req
            const { product } = req.body

            const userCart = await cartModel.findOne({ cart_user_id: new Types.ObjectId(user?._id) })
            if (!userCart) {
                  return await CartService.createCart({ user_id: user?._id, product })
            }

            if (userCart.cart_products.length === 0) {
                  userCart.cart_products = [product] as Types.DocumentArray<CartProduct>
                  userCart.cart_count_product += 1
                  return { cart: await userCart.save() }
            }

            const foundProduct = await cartModel.findOne({ 'cart_products.product_id': product.product_id })
            console.log({ foundProduct })

            if (!foundProduct) {
                  const query = { cart_user_id: new Types.ObjectId(user?._id) }

                  const update = { $addToSet: { cart_products: product }, $inc: { cart_count_product: 1 } }
                  const option = { new: true, upsert: true }

                  const cart = await cartModel.findOneAndUpdate(query, update, option)
                  console.log({ cart, product })

                  return { cart }
            }

            const query = { cart_user_id: new Types.ObjectId(user?._id), 'cart_products.product_id': product.product_id }

            const update = { $inc: { 'cart_products.$.quantity': product.quantity } }
            const option = { new: true, upsert: true }

            const cart = await cartModel.findOneAndUpdate(query, update, option)
            console.log({ cart, product })

            return { cart }
      }

      static async getCountProductCart(req: IRequestCustom) {
            const { user } = req
            const countCart = await cartModel.findOne({ cart_user_id: new mongoose.Types.ObjectId(user?._id) })
            if (!countCart) throw new BadRequestError({ detail: 'Lỗi máy chủ' })
            return { count: countCart.cart_count_product }
      }

      static async getMyCart(req: IRequestCustom) {
            const { user } = req
            const foundCart = await cartModel
                  .findOne({ cart_user_id: user?._id })
                  .populate({
                        path: 'cart_products.product_id',
                        populate: {
                              path: 'shop_id',
                              select: {
                                    shop_name: 1,
                                    shop_avatar: 1,
                                    shop_avatar_default: 1
                              }
                        },
                        select: {
                              product_thumb_image: 1,
                              product_price: 1,
                              product_name: 1,
                              product_id: 1,
                              product_state: 1
                        }
                  })
                  .populate({
                        path: 'shop_id',
                        select: {
                              shop_name: 1,
                              shop_avatar: 1,
                              shop_avatar_default: 1
                        }
                  })

            console.log({ foundCart: JSON.stringify(foundCart) })
            if (!foundCart) throw new BadRequestError({ detail: 'Lỗi máy chủ' })
            return { cart: foundCart }
      }

      static async changeQuantityProductCart(req: IRequestCustom) {
            // const { mode, quantity, cart_id } = req.body
            // let update
            // const foundCart = await cartModel.findOne({ _id: cart_id })
            // if (!foundCart) throw new BadRequestError({ detail: 'Lỗi máy chủ' })
            // const updateQuantity: number = foundCart.cart_quantity + Number(quantity)
            // const updatePrice: number = updateQuantity * foundCart.cart_product_price_origin
            // console.log({ updateQuantity, updatePrice })
            // if (mode === 'DECREASE') {
            //       update = await cartModel.findOneAndUpdate(
            //             { _id: new mongoose.Types.ObjectId(cart_id) },
            //             { $set: { cart_quantity: updateQuantity, cart_product_price: updatePrice } },
            //             { new: true, upsert: true }
            //       )
            // }
            // if (mode === 'INCREASE') {
            //       update = await cartModel.findOneAndUpdate(
            //             { _id: new mongoose.Types.ObjectId(cart_id) },
            //             { $set: { cart_quantity: updateQuantity, cart_product_price: updatePrice } },
            //             { new: true, upsert: true }
            //       )
            // }
            // if (mode === 'INPUT') {
            //       let updateQuantity: number | null
            //       let updatePrice: number | null
            //       if (quantity === 0 || quantity === 1) {
            //             updateQuantity = 1
            //             updatePrice = updateQuantity * foundCart.cart_product_price_origin
            //       } else {
            //             updateQuantity = Number(quantity)
            //             updatePrice = updateQuantity * foundCart.cart_product_price_origin
            //       }
            //       update = await cartModel.findOneAndUpdate(
            //             { _id: new mongoose.Types.ObjectId(cart_id) },
            //             { $set: { cart_quantity: updateQuantity as number, cart_product_price: updatePrice } },
            //             { new: true, upsert: true }
            //       )
            //       console.log({ update })
            // }
            // return { quantity: update?.cart_quantity }
      }

      static async selectAllCart(req: IRequestCustom) {
            const { user } = req
            const { select } = req.body
            console.log({ body: req.body })

            const product_list_id = await productModel.distinct('_id', { product_state: true })
            const updateAllCart = await cartModel.updateMany(
                  { cart_user_id: new Types.ObjectId(user?._id), cart_product_id: { $in: product_list_id } },
                  { $set: { cart_is_select: select } },
                  { new: true }
            )

            const updateUser = await userModel.findOneAndUpdate(
                  { _id: new Types.ObjectId(user?._id) },
                  { $set: { isCartSelectAll: select } },
                  { new: true, upsert: true }
            )

            const result = await cartModel.find({ cart_user_id: new Types.ObjectId(user?._id) })
            if (!updateAllCart) throw new BadRequestError({ detail: 'Lỗi máy chủ' })

            console.log({ updateAllCart })
            return { cart: result, user: updateUser, current_select: updateUser.isCartSelectAll }
      }

      static async selectOneCart(req: IRequestCustom) {
            //       const { cart_id, value } = req.body
            //       const updateCart = await cartModel.findOneAndUpdate(
            //             { _id: new Types.ObjectId(cart_id) },
            //             { $set: { cart_is_select: value } },
            //             { new: true, upsert: true }
            //       )
            //       return { cartUpdateItem: { cart_id: updateCart._id, cart_is_select: updateCart.cart_is_select } }
      }

      static async calculatorPrice(req: IRequestCustom) {
            const { user } = req
            const cart = await cartModel
                  .find({ cart_user_id: new Types.ObjectId(user?._id), cart_is_select: true })
                  .populate({
                        path: 'cart_product_id',
                        model: 'Product',
                        match: { product_state: true },
                        select: '_id product_thumb_image product_price product_name'
                        // Lọc dựa trên điều kiện "product_available: true"
                  })
                  .exec()

            return { cart }
      }
}

export default CartService
