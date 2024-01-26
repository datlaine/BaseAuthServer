import { Response } from 'express'
import mongoose from 'mongoose'
import { IRequestCustom } from '~/middlewares/authentication'
import productModel from '~/models/product.model'
import uploadToCloudinary from '~/utils/uploadCloudinary'

class ProductService {
      static async uploadProductThumb(req: IRequestCustom) {
            const file = req.file
            const { user } = req
            if (file) {
                  const folder = `users/${user?.id}/shop`
                  const result = await uploadToCloudinary(file, folder)
                  const productDemo = await productModel.create({ user_id: user?._id, product_image_thumb: (await result).secure_url })
                  return { product_thumb_image: result.secure_url, _id: productDemo._id }
            }

            return { message: 'Missing file' }
      }

      static async uploadProductFull(req: IRequestCustom) {
            const { product_name, product_price, product_thumb_image } = req.body
            const { user } = req
            const product = await productModel.findOneAndUpdate(
                  { user_id: user?._id },
                  { $set: { product_name, product_price, product_thumb_image } },
                  { new: true, upsert: true }
            )
            return { product }
      }
}

export default ProductService
