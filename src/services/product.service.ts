import { Response } from 'express'
import mongoose, { Types } from 'mongoose'
import { BadRequestError, ForbiddenError } from '~/Core/response.error'
import { OK } from '~/Core/response.success'
import cloudinary from '~/configs/cloundinary.config'
import { IRequestCustom } from '~/middlewares/authentication'
import productModel from '~/models/product.model'
import { shopModel } from '~/models/shop.model'
import sleep from '~/utils/sleep'
import uploadToCloudinary from '~/utils/uploadCloudinary'

class ProductService {
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
                  .select({ _id: 1, product_name: 1, product_price: 1, product_thumb_image: 1 })
            return { products: products }
      }

      static async getProductWithId(req: IRequestCustom) {
            const id = req.params.id
            console.log({ id })
            const product = await productModel.findOne({ _id: new mongoose.Types.ObjectId(id), product_state: true }).populate('shop_id')
            if (!product) return { product: null }
            // await sleep(3000)
            return { product }
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

            const deleteProduct = await productModel.findOneAndUpdate(
                  { _id: product_id },
                  { $set: { product_state: false } },
                  { new: true, upsert: true }
            )
            if (!deleteProduct) throw new BadRequestError({ detail: 'Xóa sản phẩm thất bại' })
            return { message: 'Xóa thành công' }
      }
}

export default ProductService

//  Created by Lai Huynh Phat Dat on 25/02/2024.
//
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//
//                _ooOoo_                       NAM MÔ A DI ĐÀ PHẬT !
//               o8888888o
//               88" . "88      Thí chủ con tên là Nguyễn Quốc Việt, dương lịch ba mươi tháng tám năm 1998
//               (| -_- |)      Ngụ tại số nhà 23B/17 Nguyễn Văn Trỗi, Mộ Lao, Hà Nội, Việt Nam
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
