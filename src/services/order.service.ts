import { ObjectId, Types } from 'mongoose'
import { IRequestCustom } from '~/middlewares/authentication'
import { CartProduct, CartProductWithId, cartModel } from '~/models/cart.modal'
import { notificationModel } from '~/models/notification.model'
import { orderModel } from '~/models/order.model'
import productModel from '~/models/product.model'
import { shopModel } from '~/models/shop.model'
import { renderNotificationProduct, renderNotificationSystem } from '~/utils/notification.util'

class OrderService {
      static async orderAddProduct(req: IRequestCustom<{ orders: { products: CartProductWithId[]; order_total: number } }>) {
            const { user } = req
            const { products, order_total } = req.body.orders
            // console.log({ body: req.body })

            //ORDER MODEL
            const query = { order_user_id: new Types.ObjectId(user?._id) }
            const update = { $addToSet: { order_products: { products: products, order_total } } }
            const option = { new: true, upsert: true, multi: true }
            const updateOrder = await orderModel.findOneAndUpdate(query, update, option)

            //CART MODEL
            const productId = products.map((product) => product.product_id._id)
            const queryCart = { cart_user_id: new Types.ObjectId(user?._id) }
            const updateCart = {
                  $pull: { cart_products: { product_id: { $in: productId } } },
                  $inc: { cart_count_product: -productId.length }
            }
            const optionCart = { new: true, upsert: true, multi: true }
            const updateCartDocument = await cartModel.findOneAndUpdate(queryCart, updateCart, optionCart)

            //PRODUCT MODEL
            for (let index = 0; index < products.length; index++) {
                  await productModel.findOneAndUpdate(
                        { _id: productId[index] },
                        { $inc: { product_available: -products[index].quantity, product_is_bought: products[index].quantity } },
                        { new: true, upsert: true }
                  )
            }

            const elementLast = updateOrder?.order_products[updateOrder?.order_products.length - 1]

            //NOTIFICATION MODEL
            // const elementLast = await orderModel.findOne(query, { 'cart_products.products': { $slice: -1 } })
            for (let index = 0; index < products.length; index++) {
                  await notificationModel.findOneAndUpdate(
                        { notification_user_id: new Types.ObjectId(user?._id) },
                        {
                              $inc: { notification_count: 1 },
                              $push: {
                                    notifications_message: [
                                          renderNotificationProduct({
                                                message: 'Mua thành công',
                                                sender_id: user?._id,
                                                product_id: elementLast!._id as Types.ObjectId
                                          })
                                    ]
                              }
                        },
                        { new: true, upsert: true }
                  )
            }

            //SHOP MODEL
            for (let index = 0; index < products.length; index++) {
                  const onwer = await shopModel
                        .findOne({ _id: elementLast?.products[index].shop_id })
                        .populate({ path: 'owner', select: { _id: 1 } })
                  console.log({ shop: elementLast?.products[index].shop_id, onwer })
                  // const user_id = onwer?.owner._id
                  const a = await notificationModel.findOneAndUpdate(
                        { notification_user_id: new Types.ObjectId(onwer?.owner._id) },
                        {
                              $inc: { notification_count: 1 },
                              $push: {
                                    notifications_message: [
                                          renderNotificationSystem(`Đã bán thành công ${products[index].quantity} sản phẩm`)
                                    ]
                              }
                        },
                        { new: true, upsert: true }
                  )

                  console.log({ a })
            }

            console.log({ updateOrder, products: JSON.stringify(products), user: user?._id, a: JSON.stringify(updateOrder) })
            return 1
      }

      static async getMyOrder(req: IRequestCustom) {
            const { user } = req
            const query = { order_user_id: new Types.ObjectId(user?._id) }

            const myOrder = await orderModel
                  .findOne(query)
                  .populate({
                        path: 'order_products.products.product_id',
                        select: { product_name: 1, product_thumb_image: 1, product_price: 1 }
                  })
                  .populate({
                        path: 'order_products.products.shop_id',
                        select: {
                              shop_name: 1
                        }
                  })

            return { order: myOrder }
      }

      static async buyAgain(req: IRequestCustom<{ products: CartProduct[] }>) {
            console.log({ body: JSON.stringify(req.body.products) })
            const { user } = req
            const products = req.body.products
            console.log({ length: products.length })
            const query = { cart_user_id: new Types.ObjectId(user?._id) }
            const update = { $push: { cart_products: { $each: products, $position: 0 } }, $inc: { cart_count_product: products.length } }
            const option = { new: true, upsert: true }

            const updateCart = await cartModel.findOneAndUpdate(query, update, option)

            return { message: 'OK' }
      }
}

export default OrderService
