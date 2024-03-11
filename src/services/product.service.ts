import { Response } from 'express'
import mongoose, { Types } from 'mongoose'
import { BadRequestError, ForbiddenError } from '~/Core/response.error'
import { OK } from '~/Core/response.success'
import cloudinary from '~/configs/cloundinary.config'
import { HEADER, IRequestCustom } from '~/middlewares/authentication'
import { commentModel } from '~/models/comment.model'
import { notificationModel } from '~/models/notification.model'
import productModel, { ProductType } from '~/models/product.model'
import { TShopDoc, productShopModel, shopModel } from '~/models/shop.model'
import userModel from '~/models/user.model'
import CommentRepository from '~/repositories/comment.repository'
import { renderNotificationSystem } from '~/utils/notification.util'
import uploadToCloudinary from '~/utils/uploadCloudinary'

class ProductService {
      static async searchQuery(req: IRequestCustom) {
            const { text } = req.query

            console.log({ text })

            const products = await productModel
                  .find({ $text: { $search: text as string } })
                  .select('product_name _id product_thumb_image product_votes')
                  .skip(0)
                  .limit(4)

            const shops = await shopModel
                  .find({ $text: { $search: text as string } })
                  .select('shop_name _id')
                  .skip(0)
                  .limit(2)

            return { products, shops }
      }

      static async createBaseProductId(req: IRequestCustom) {
            const { user } = req
            const foundShop = await shopModel.findOne({ owner: user?._id })

            const createProduct = await productModel.findOneAndUpdate(
                  { _id: new mongoose.Types.ObjectId() },
                  { $set: { owner: foundShop?._id } },
                  { new: true, upsert: true }
            )

            return { product_id: createProduct?._id }
      }

      static async uploadProductDescriptionImageOne(req: IRequestCustom) {
            const file = req.file
            const { user } = req
            const { product_id } = req.body
            console.log({ product_id })
            if (file) {
                  const folder = `users/${user?.id}/product`
                  const result = await uploadToCloudinary(file, folder)
                  const productDemo = await productModel.findOneAndUpdate(
                        {
                              _id: new mongoose.Types.ObjectId(product_id)
                        },
                        {
                              $addToSet: {
                                    product_desc_image: { secure_url: result.secure_url, public_id: result.public_id }
                              }
                        },
                        { new: true, upsert: true }
                  )
                  return {
                        product: {
                              product_id: productDemo._id,
                              public_id: result.public_id,
                              secure_url: result.secure_url
                        }
                  }
            }

            return { message: 'Missing file' }
      }

      static async deleteProductDescriptionImageOne(req: IRequestCustom) {
            const { public_id, product_id } = req.body
            if (!product_id || !public_id) return { message: 'Không tìm thấy id hoặc public_id' }

            const result = await cloudinary.uploader.destroy(public_id)
            const deleteProduct = await productModel.findOneAndUpdate(
                  { _id: product_id },
                  { $pull: { product_desc_image: { public_id } } },
                  { new: true, upsert: true }
            )
            if (!result) return result
            return { message: 'Xoa thanh cong' }
      }

      static async uploadProductThumb(req: IRequestCustom) {
            const file = req.file
            const { user } = req
            const { product_id } = req.body
            console.log({ user })
            if (file) {
                  const folder = `users/${user?.id}/product`
                  const result = await uploadToCloudinary(file, folder)
                  const productDemo = await productModel.findOneAndUpdate(
                        {
                              _id: new mongoose.Types.ObjectId(product_id)
                        },
                        {
                              $set: {
                                    product_thumb_image: { secure_url: result.secure_url, public_id: result.public_id }
                              }
                        },
                        { new: true, upsert: true }
                  )
                  return {
                        product: {
                              product_id: productDemo._id,
                              product_thumb_image: productDemo.product_thumb_image
                        }
                  }
            }

            return { message: 'Missing file' }
      }

      static async getProductShop(req: IRequestCustom) {
            const user = req.user
            const foundShop = await shopModel.findOne({ owner: new Types.ObjectId(user?._id) })

            const product_all = await productModel.find({
                  shop_id: foundShop?._id
            })
            const result = product_all.map((product) => {
                  return product.product_desc_image.map((img) => {
                        const config = cloudinary.url(img.public_id, { width: 100, height: 100 })
                        img.secure_url = config
                        return img
                  })
            })

            return { product_all }
      }

      static async deleteProductThumb(req: IRequestCustom) {
            const public_id = req.body.public_id
            const id = req.body.id
            if (!id || !public_id) return { message: 'Không tìm thấy id hoặc public_id' }
            const result = await cloudinary.uploader.destroy(public_id)
            const deleteProduct = await productModel.findOneAndUpdate(
                  { _id: id },
                  { $unset: { product_thumb_image: 1 } },
                  { new: true, upsert: true }
            )
            if (!result) return result
            return { message: 'Xoa thanh cong' }
      }

      static async deleteProductImageFull(req: IRequestCustom) {
            const id = req.body.id
            if (!id) throw new BadRequestError({ detail: 'Khong co id' })
            const productSelect = await productModel.findOne({ _id: new Types.ObjectId(id) }).select({ product_desc_image: 1 })
            productSelect?.product_desc_image.forEach(async (product) => {
                  await cloudinary.uploader.destroy(product.public_id)
            })
            const productDemo = await productModel
                  .findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $unset: { product_desc_image: 1 } })
                  .lean()

            return { message: productDemo }
      }

      static async getAllProduct(req: IRequestCustom) {
            const products = await productModel
                  .find({ isProductFull: true })
                  .limit(36)
                  .sort({ product_price: 1 })
                  .select({ _id: 1, product_name: 1, product_price: 1, product_thumb_image: 1, product_votes: 1 })
            const count = products.length
            return { products: products, count }
      }

      static async getAllProductCare(req: IRequestCustom) {
            const products = await productModel
                  .find({ isProductFull: true })
                  .limit(18)
                  .sort({ product_price: -1 })
                  .select({ _id: 1, product_name: 1, product_price: 1, product_thumb_image: 1, product_votes: 1 })

            return { products }
      }

      static async getProductSimilar(req: IRequestCustom) {
            const { product_type, type, product_id } = req.query

            const productQuery = { product_type: product_type as string, _id: { $nin: [new Types.ObjectId(product_id as string)] } }

            const products = await productModel
                  .find(productQuery)
                  .select({ _id: 1, product_name: 1, product_price: 1, product_thumb_image: 1, product_votes: 1 })
                  .limit(35)

            return { products }
      }

      static async getProductWithId(req: IRequestCustom) {
            const id = req.params.id
            console.log({ id })
            const product = await productModel.findOne({ _id: new mongoose.Types.ObjectId(id), product_state: true }).populate('shop_id')
            const { user } = req
            console.log({ user })

            const client_id = req.headers[HEADER.CLIENT_ID]
            if (client_id) {
                  const userDocument = await userModel.findOne({ _id: new Types.ObjectId(client_id as string) })

                  // console.log({ productSee: JSON.stringify(userDocument?.product_see) })

                  const see = await userModel.findOneAndUpdate(
                        { _id: new Types.ObjectId(client_id as string) },
                        { $addToSet: { product_see: { product_id: new Types.ObjectId(product?._id) } } },
                        { new: true }
                  )
            }
            const calcVoteAgain: { avgProductVote: number; totalComment: number } = await CommentRepository.calcTotalAndAvgProduct({
                  product_id: new Types.ObjectId(id)
            })

            const detailComment = await CommentRepository.getCommentDetail({ product_id: new Types.ObjectId(id) })
            const result = await commentModel.aggregate([
                  {
                        $match: {
                              comment_product_id: new Types.ObjectId(id as string)
                        }
                  },

                  {
                        $group: {
                              _id: '$comment_vote',
                              count: { $sum: 1 }
                        }
                  }
            ])

            console.log({ detailComment, result })
            if (!product) return { product: null }
            return {
                  product,
                  totalComment: calcVoteAgain?.totalComment || 0,
                  avg: calcVoteAgain?.avgProductVote || product.product_votes,
                  detailComment
            }
      }

      static async getProductWithIdUpdate(req: IRequestCustom) {
            const id = req.params.id
            console.log({ id })
            const product = await productModel.findById({ _id: new mongoose.Types.ObjectId(id) }).populate('shop_id', 'shop_name')
            const { user } = req
            const foundShop = await shopModel.findOne({ owner: user?._id })
            if (!foundShop) {
                  throw new ForbiddenError({ detail: 'Sản phẩm thuộc về cửa hàng khác' })
            }

            return { product }
      }

      static async protectProduct(req: IRequestCustom) {
            const id = req.params.product_id
            const { user } = req

            const foundShop = await shopModel.findOne({ owner: user?._id })
            const foundProduct = await productModel.findOne({ _id: id, shop_id: foundShop?._id })
            if (!foundShop) {
                  // throw new ForbiddenError({ detail: 'Sản phẩm thuộc về cửa hàng khác' })
                  return { product: null }
            }
            return { product: foundProduct }
      }

      static async deleteProductWithId(req: IRequestCustom) {
            const { product_id } = req.params
            const { user } = req

            const deleteProduct = await productModel.findOneAndUpdate(
                  { _id: product_id },
                  { $set: { product_state: false } },
                  { new: true, upsert: true }
            )
            if (!deleteProduct) throw new BadRequestError({ detail: 'Xóa sản phẩm thất bại' })

            const foundShop = await shopModel.findOne({ onwer: new Types.ObjectId(user?._id) })

            const productShopQuery = { shop_id: new Types.ObjectId(foundShop?._id) }
            const productShopUpdate = { $set: { products: { state: 'Delete' } } }
            const productShopOptions = { new: true, upsert: true }

            await productShopModel.findOneAndUpdate(productShopQuery, productShopUpdate, productShopOptions)

            const query = { notification_user_id: new Types.ObjectId(user?._id) }
            const update = {
                  $push: {
                        notifications_message: renderNotificationSystem('Bạn đã xóa thành công 1 sản phẩm')
                  },
                  $inc: { notification_count: 1 }
            }
            const optionNotification = { new: true, upsert: true }
            await notificationModel.findOneAndUpdate(query, update, optionNotification)
            return { message: 'Xóa thành công' }
      }

      static async getAllProductWithType(req: IRequestCustom) {
            console.log('OK')
            const { product_type, minVote = 1, maxVote = 5, minPrice = 1, maxPrice = 1000000000, page } = req.query
            const limit = 2
            const skipDocument = limit * (Number(page) - 1)
            const products = await productModel
                  .find({
                        product_type
                  })
                  .skip(skipDocument)
                  .limit(limit)
                  .populate('shop_id')

            let featuredCategory: string[] = []

            const shops = await productModel.find({ product_type }).populate('shop_id')
            const set = new Set()
            const shop_id: TShopDoc[] = []
            shops.filter((product) => {
                  let index = shop_id.findIndex((shop) => shop._id === product.shop_id._id)
                  if (index <= -1) {
                        shop_id.push(product.shop_id as unknown as TShopDoc)
                        return
                  }
                  return null
            })

            // const type = await ProductRepository.countProductWithType({ product_type: product_type as ProductType })
            const count = (await productModel.find({ product_type: product_type as ProductType })).length
            const a = await productModel.find({ 'attribute.product_food_type': 'Fast food' })
            return { products, count, shops: shop_id }
      }

      static async getProductFilter(
            req: IRequestCustom<{ product_vote: number; minPrice: number; maxPrice: number; product_type: ProductType; page: number }>
      ) {
            const { page = 1, maxPrice, minPrice, product_type, vote } = req.query
            const LIMIT = 2
            const getDocument = LIMIT * (Number(page) - 1)
            console.log({ LIMIT, getDocument })
            const products = await productModel
                  .find({
                        product_type,
                        product_price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
                        product_votes: { $gte: Number(vote) }
                  })
                  .skip(getDocument)
                  .limit(LIMIT)

            return { products }
      }
}

export default ProductService

//  Created by Lai Huynh Phat Dat on 25/02/2024.
//
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//
//                _ooOoo_                       NAM MÔ A DI ĐÀ PHẬT !
//               o8888888o
//               88" . "88
//               (| -_- |)
//                O\ = /O
//            ____/`---'\____         Con lạy chín phương trời, con lạy mười phương đất
//            .' \\| |// `.             Chư Phật mười phương, mười phương chư Phật
//           / \\||| : |||// \        Con ơn nhờ Trời đất chổ che, Thánh Thần cứu độ
//         / _||||| -:- |||||- \    Xin nhất tâm kính lễ Hoàng thiên Hậu thổ, Tiên Phật Thánh Thần
//           | | \\\ - /// | |              Giúp đỡ con code sạch ít bug
//         | \_| ''\---/'' | |           Đồng nghiệp vui vẻ, sếp quý tăng lương
//         \ .-\__ `-` ___/-. /          Sức khoẻ dồi dào, tiền vào như nước
//       ___`. .' /--.--\ `. . __
//    ."" '< `.___\_<|>_/___.' >'"". NAM MÔ VIÊN THÔNG GIÁO CHỦ ĐẠI TỪ ĐẠI BI TẦM THANH CỨU KHỔ CỨU NẠN
//   | | : `- \`.;`\ _ /`;.`/ - ` : | |  QUẢNG ĐẠI LINH CẢM QUÁN THẾ ÂM BỒ TÁT
//     \ \ `-. \_ __\ /__ _/ .-` / /
//======`-.____`-.___\_____/___.-`____.-'======
//                `=---='
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//
