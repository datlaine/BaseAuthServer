import { Response } from 'express'
import mongoose from 'mongoose'
import cloudinary from '~/configs/cloundinary.config'
import { IRequestCustom } from '~/middlewares/authentication'
import productModel from '~/models/product.model'
import uploadToCloudinary from '~/utils/uploadCloudinary'

class ProductService {
      static async uploadProductThumb(req: IRequestCustom) {
            const file = req.file
            const { user } = req
            if (file) {
                  // console.log({ id: req.body.product_id })
                  const folder = `users/${user?.id}/shop`
                  const result = await uploadToCloudinary(file, folder)
                  const productDemo = await productModel.findOneAndUpdate(
                        {
                              // _id: req.body.product_id || new mongoose.Types.ObjectId(),
                              product_thumb_image: { secure_url: result.secure_url, public_id: result.public_id }
                        },
                        { user_id: user?._id },
                        { new: true, upsert: true }
                  )
                  return {
                        product: {
                              product_id: productDemo._id,
                              product_thumb_image: { secure_url: result.secure_url, public_id: result.public_id }
                        }
                  }
            }

            return { message: 'Missing file' }
      }

      static async uploadProductFull(req: IRequestCustom) {
            const { product_name, product_price, product_thumb_image_url, product_thumb_image_public_id, product_id } = req.body
            const { user } = req
            const product = await productModel.findOneAndUpdate(
                  {
                        _id: product_id
                        // product_thumb_image: { secure_url: product_thumb_image_url, public_id: product_thumb_image_public_id }
                  },
                  {
                        $set: {
                              product_name,
                              product_price,
                              product_thumb_image: { secure_url: product_thumb_image_url, public_id: product_thumb_image_public_id }
                        }
                  },
                  { new: true, upsert: true }
            )
            return { product }
      }

      static async getAllProduct(req: IRequestCustom) {
            const user = req.user
            const product_all = await productModel.find({ user_id: user?._id }).lean()

            return { product_all }
      }

      static async deleteProductThumb(req: IRequestCustom) {
            const public_id = req.body.public_id
            const id = req.body.id

            console.log({ public_id, id })
            const result = await cloudinary.uploader.destroy(public_id)
            const deleteProduct = await productModel.deleteOne({ _id: id })
            console.log({ deleteProduct })
            if (!result) return result
            return { message: 'Xoa thanh cong' }
      }
}

export default ProductService
