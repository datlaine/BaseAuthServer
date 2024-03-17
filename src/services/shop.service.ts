import { SortOrder, Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import cloudinary from '~/configs/cloundinary.config'
import { IRequestCustom } from '~/middlewares/authentication'
import { notificationModel } from '~/models/notification.model'
import productModel, { IProduct } from '~/models/product.model'
import { TShop, TShopDoc, productShopModel, shopModel } from '~/models/shop.model'
import userModel from '~/models/user.model'
import { renderNotificationSystem } from '~/utils/notification.util'
import sleep from '~/utils/sleep'
import uploadToCloudinary from '~/utils/uploadCloudinary'

class ShopService {
      static async registerShop(req: IRequestCustom) {
            const { shop_name, data } = req.body
            const { user } = req
            const { file } = req
            const { state, mode } = req.query

            let update = {}
            if (state === 'Full') {
                  if (!file) throw new BadRequestError({ detail: 'Missing File' })
                  const folder = `user/${user?._id}/shop`
                  const result = await uploadToCloudinary(file, folder)
                  update = {
                        $set: { shop_name, shop_avatar: { secure_url: result.secure_url, public_id: result.public_id } }
                  }
            }

            if (state === 'no-file') {
                  update = {
                        $set: { shop_name }
                  }
            }

            const registerShop = await shopModel.findOneAndUpdate({ owner: new Types.ObjectId(user?._id) }, update, {
                  new: true,
                  upsert: true
            })

            console.log({ shop: JSON.stringify(registerShop), _id: registerShop?._id })

            const productShop = await productShopModel.findOneAndUpdate(
                  { shop_id: registerShop._id },
                  { $set: { shop_id: registerShop._id } },
                  { new: true, upsert: true }
            )

            const updateUser = await userModel.findOneAndUpdate(
                  { _id: user?._id },
                  { $set: { isOpenShop: true } },
                  { new: true, upsert: true }
            )

            const queryNotification = { notification_user_id: new Types.ObjectId(user?._id) }
            const updateNotifcation = {
                  $push: {
                        notifications_message: renderNotificationSystem(
                              mode === 'UPDATE' ? 'Cập nhập thông tin cửa hàng thành công' : 'Đăng kí mở cửa hàng thành công'
                        )
                  },
                  $inc: { notification_count: 1 }
            }
            const optionNotification = { new: true, upsert: true }

            const result = await notificationModel.findOneAndUpdate(queryNotification, updateNotifcation, optionNotification)
            console.log({ notifiaction: result })
            return { shop: registerShop, user: updateUser }
      }

      static async UploadAvatarShop(req: IRequestCustom) {
            const file = req.file
            console.log({ file })
            if (!file) throw new BadRequestError({ detail: 'Không có file' })
            const { user } = req
            const folder = `user/${user?._id}/shop`
            const result = await uploadToCloudinary(file, folder)

            const shopUpdate = await shopModel.findOneAndUpdate(
                  { owner: user?._id },
                  {
                        $set: { shop_avatar: { secure_url: result.secure_url, public_id: result.public_id } }
                  },

                  { new: true, upsert: true }
            )
            return { shop_id: shopUpdate._id, shop_avatar: shopUpdate.shop_avatar }
      }

      static async deleteAvatarShop(req: IRequestCustom) {
            const { shop_id, public_id } = req.body
            const resultRemove = await cloudinary.uploader.destroy(public_id)
            const removeDocument = await shopModel.findOneAndUpdate({ _id: new Types.ObjectId(shop_id) }, { $unset: { shop_avatar: 1 } })
            console.log({ removeDocument, resultRemove })
            return { message: 'Xóa thành công' }
      }

      static async getMyShop(req: IRequestCustom) {
            const { user } = req
            const foundShop = await shopModel.findOne({ owner: user?._id })
            if (!foundShop) throw new BadRequestError({ detail: 'Không tìm thấy Shop' })
            return { shop: foundShop }
      }

      static async getProductMyShop(req: IRequestCustom) {
            const { user } = req
            console.log({ id: user?._id })
            // const foundProductMyShop = await productModel
            //       .find()
            //       .populate({ path: 'shop_id', match: { onwer: { $ne: new Types.ObjectId(user?._id) } } })
            // console.log({ foundProductMyShop })
            const shop = await shopModel.findOne({ owner: new Types.ObjectId(user?._id) })
            const foundProductMyShop = await productModel.find({ shop_id: shop?._id, product_state: true })

            console.log({ foundProductMyShop })
            return { myProductOfShop: foundProductMyShop }
      }

      static async foundShopHasProductType(req: IRequestCustom) {
            const { product_type } = req.query
            const filterProductType = await productModel.find({ product_type }).populate('shop_id')

            const shop_unique: TShopDoc[] = []

            filterProductType.filter((p) => {
                  const foundShop = shop_unique.findIndex((shop) => shop._id === p.shop_id._id)
                  if (foundShop === -1) {
                        shop_unique.push(p.shop_id as unknown as TShopDoc)
                  }
                  return
            })

            return { shops: shop_unique }
      }

      static async getShopInfoOfProduct(req: IRequestCustom) {
            const { shop_id } = req.query

            const foundShop = await shopModel.findOne({ _id: new Types.ObjectId(shop_id as string) })

            return { shop: foundShop }
      }

      static async getShopId(req: IRequestCustom) {
            const { shop_id } = req.query
            const shop = await shopModel.findOne({ _id: new Types.ObjectId(shop_id as string) })

            return { shop }
      }

      static async getProductFilter(req: IRequestCustom) {
            const { page, limit, shop_id, sort, inc } = req.query
            const PAGE = Number(page)
            const INC = Number(inc)

            const LIMIT = Number(limit)
            const SKIP = LIMIT * (PAGE - 1)
            const filter = { [sort as keyof IProduct]: INC }

            const shopQuery = { _id: new Types.ObjectId(shop_id as string) }

            const shop = await shopModel
                  .findOne(shopQuery)
                  // .skip(SKIP)
                  // .limit(LIMIT)
                  .populate({
                        path: 'shop_products',
                        options: {
                              skip: SKIP,
                              limit: LIMIT,
                              select: {
                                    _id: 1,
                                    product_name: 1,
                                    product_price: 1,
                                    product_thumb_image: 1,
                                    product_votes: 1,
                                    product_is_bought: 1,
                                    product_desc_image: 1
                              },
                              sort: filter
                        }
                  })

            console.log({ SKIP, LIMIT })
            return { shop: shop || { shop_products: [] } }
      }
}

export default ShopService
