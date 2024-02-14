import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import cloudinary from '~/configs/cloundinary.config'
import { IRequestCustom } from '~/middlewares/authentication'
import productModel from '~/models/product.model'
import { shopModel } from '~/models/shop.model'
import userModel from '~/models/user.model'
import sleep from '~/utils/sleep'
import uploadToCloudinary from '~/utils/uploadCloudinary'

class ShopService {
      static async registerShop(req: IRequestCustom) {
            const { shop_name } = req.body
            const { user } = req
            console.log({ shop_name })
            console.log({ user })
            // const shop_name = 'Quán ăn nhà Đạt'

            const registerShop = await shopModel.findOneAndUpdate(
                  { owner: new Types.ObjectId(user?._id) },
                  {
                        $set: { shop_name }
                  },
                  { new: true, upsert: true }
            )

            const updateUser = await userModel.findOneAndUpdate(
                  { _id: user?._id },
                  { $set: { isOpenShop: true } },
                  { new: true, upsert: true }
            )
            return { shop: registerShop, user: updateUser }
      }

      static async UploadAvatarShop(req: IRequestCustom) {
            const file = req.file
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
            await sleep(3000)
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
            const foundProductMyShop = await productModel.find({ shop_id: shop?._id })

            console.log({ foundProductMyShop })
            return { myProductOfShop: foundProductMyShop }
      }
}

export default ShopService
