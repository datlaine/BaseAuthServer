import { Response } from 'express'
import mongoose, { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { OK } from '~/Core/response.success'
import cloudinary from '~/configs/cloundinary.config'
import { IRequestCustom } from '~/middlewares/authentication'
import productModel from '~/models/product.model'
import uploadToCloudinary from '~/utils/uploadCloudinary'

class ProductService {
      static async uploadProductThumb(req: IRequestCustom) {
            const file = req.file
            const { user } = req
            console.log({ user })
            if (file) {
                  const folder = `users/${user?.id}/shop`
                  const result = await uploadToCloudinary(file, folder)
                  const productDemo = await productModel.findOneAndUpdate(
                        {
                              _id: new mongoose.Types.ObjectId()
                        },
                        {
                              $set: {
                                    user_id: user?._id,
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

      static async uploadProductImageFull(req: IRequestCustom) {
            // const files = JSON.parse(JSON.stringify(req.files))
            const files = req.files
            const id = req.body.id
            if (!files) return { message: 'Missing' }
            const result = []
            const { user } = req
            console.log({ id })
            const folder = `users/${user?.id}/shop`

            for (const file of files as any[]) {
                  const secure_url = await uploadToCloudinary(file, folder)
                  result.push(secure_url)
            }

            const productDemo = await productModel.findOneAndUpdate(
                  {
                        _id: id
                  },
                  {
                        $addToSet: {
                              product_desc_image: {
                                    $each: [
                                          { secure_url: result[0].secure_url, public_id: result[0].public_id },
                                          { secure_url: result[1].secure_url, public_id: result[1].public_id },
                                          { secure_url: result[2].secure_url, public_id: result[2].public_id },
                                          { secure_url: result[3].secure_url, public_id: result[3].public_id }
                                    ]
                              }
                        }
                  },
                  { new: true, upsert: true }
            )

            return {
                  product: {
                        // product_id: result[0].se
                        productDemo,
                        product_thumb_image: [
                              { secure_url: result[0].secure_url, public_id: result[0].public_id },
                              { secure_url: result[1].secure_url, public_id: result[1].public_id },
                              { secure_url: result[2].secure_url, public_id: result[2].public_id },
                              { secure_url: result[3].secure_url, public_id: result[3].public_id }
                        ]
                  }
            }
      }

      static async uploadProductFull(req: IRequestCustom) {
            const { product_name, product_price, product_thumb_image_url, product_thumb_image_public_id, product_id } = req.body
            const { user } = req
            const product = await productModel.findOneAndUpdate(
                  {
                        _id: product_id
                  },
                  {
                        $set: {
                              product_name,
                              product_price,
                              product_thumb_image: { secure_url: product_thumb_image_url, public_id: product_thumb_image_public_id },
                              isProductFull: true
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
            if (!id || !public_id) return { message: 'Không tìm thấy id hoặc public_id' }
            const result = await cloudinary.uploader.destroy(public_id)
            const deleteProduct = await productModel.deleteOne({ _id: id })
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
}

export default ProductService
