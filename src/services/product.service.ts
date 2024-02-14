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

            // console.log({ createProduct })
            // await sleep(3000)
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

      // static async updateProductThumb(req: IRequestCustom) {
      //       const file = req.file
      //       const { user } = req
      //       const { product_id, public_id } = req.body
      //       const result = await cloudinary.uploader.destroy(public_id)

      //       console.log({ user })
      //       if (file) {
      //             const folder = `users/${user?.id}/product`
      //             const result = await uploadToCloudinary(file, folder)
      //             const productDemo = await productModel.findOneAndUpdate(
      //                   {
      //                         _id: new mongoose.Types.ObjectId(product_id)
      //                   },
      //                   {
      //                         $set: {
      //                               product_thumb_image: { secure_url: result.secure_url, public_id: result.public_id }
      //                         }
      //                   },
      //                   { new: true, upsert: true }
      //             )
      //             return {
      //                   product: {
      //                         product_id: productDemo._id,
      //                         product_thumb_image: productDemo.product_thumb_image
      //                   }
      //             }
      //       }

      //       return { message: 'Missing file' }
      // }

      // static async uploadProductImageFull(req: IRequestCustom) {
      //       // const files = JSON.parse(JSON.stringify(req.files))
      //       const files = req.files
      //       const id = req.body.id
      //       if (!files) return { message: 'Missing' }
      //       const result = []
      //       const { user } = req
      //       console.log({ id })
      //       const folder = `users/${user?.id}/product`

      //       for (const file of files as any[]) {
      //             const secure_url = await uploadToCloudinary(file, folder)
      //             result.push(secure_url)
      //       }

      //       const productDemo = await productModel.findOneAndUpdate(
      //             {
      //                   _id: id
      //             },
      //             {
      //                   $addToSet: {
      //                         product_desc_image: {
      //                               $each: [
      //                                     { secure_url: result[0].secure_url, public_id: result[0].public_id },
      //                                     { secure_url: result[1].secure_url, public_id: result[1].public_id },
      //                                     { secure_url: result[2].secure_url, public_id: result[2].public_id },
      //                                     { secure_url: result[3].secure_url, public_id: result[3].public_id }
      //                               ]
      //                         }
      //                   }
      //             },
      //             { new: true, upsert: true }
      //       )

      //       return {
      //             product: {
      //                   // product_id: result[0].se
      //                   productDemo,
      //                   product_thumb_image: [
      //                         { secure_url: result[0].secure_url, public_id: result[0].public_id },
      //                         { secure_url: result[1].secure_url, public_id: result[1].public_id },
      //                         { secure_url: result[2].secure_url, public_id: result[2].public_id },
      //                         { secure_url: result[3].secure_url, public_id: result[3].public_id }
      //                   ]
      //             }
      //       }
      // }

      // static async updateProductImageFull(req: IRequestCustom) {
      //       // const files = JSON.parse(JSON.stringify(req.files))
      //       const files = req.files
      //       const id = req.body.id

      //       const remove_url_array = req.body.remove_url_array
      //       await productModel.findOneAndUpdate({ _id: id }, { $unset: { product_desc_image: 1 } }, { new: true, upsert: true })
      //       console.log({ remove_url_array })

      //       remove_url_array?.forEach(async (public_id: string) => {
      //             await cloudinary.uploader.destroy(public_id)
      //       })

      //       if (!files) return { message: 'Missing' }
      //       const result = []
      //       const { user } = req
      //       console.log({ id })
      //       const folder = `users/${user?.id}/product`

      //       for (const file of files as any[]) {
      //             const secure_url = await uploadToCloudinary(file, folder)
      //             result.push(secure_url)
      //       }

      //       const productDemo = await productModel.findOneAndUpdate(
      //             {
      //                   _id: id
      //             },
      //             {
      //                   $addToSet: {
      //                         product_desc_image: {
      //                               $each: [
      //                                     { secure_url: result[0].secure_url, public_id: result[0].public_id },
      //                                     { secure_url: result[1].secure_url, public_id: result[1].public_id },
      //                                     { secure_url: result[2].secure_url, public_id: result[2].public_id },
      //                                     { secure_url: result[3].secure_url, public_id: result[3].public_id }
      //                               ]
      //                         }
      //                   }
      //             },
      //             { new: true, upsert: true }
      //       )

      //       return {
      //             product: {
      //                   // product_id: result[0].se
      //                   productDemo,
      //                   product_thumb_image: [
      //                         { secure_url: result[0].secure_url, public_id: result[0].public_id },
      //                         { secure_url: result[1].secure_url, public_id: result[1].public_id },
      //                         { secure_url: result[2].secure_url, public_id: result[2].public_id },
      //                         { secure_url: result[3].secure_url, public_id: result[3].public_id }
      //                   ]
      //             }
      //       }
      // }

      // static async uploadProductFull(req: IRequestCustom) {
      //       const { product_name, product_price, product_thumb_image_url, product_thumb_image_public_id, product_id } = req.body
      //       const { user } = req
      //       const product = await productModel.findOneAndUpdate(
      //             {
      //                   _id: product_id
      //             },
      //             {
      //                   $set: {
      //                         product_name,
      //                         product_price,
      //                         product_thumb_image: { secure_url: product_thumb_image_url, public_id: product_thumb_image_public_id },
      //                         isProductFull: true
      //                   }
      //             },
      //             { new: true, upsert: true }
      //       )
      //       return { product }
      // }

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

            // console.log({ result })
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
            const product = await productModel.findById({ _id: new mongoose.Types.ObjectId(id) }).populate('shop_id', 'shop_name')
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
            // console.log({ id })
            // const product = await productModel.findById({ _id: new mongoose.Types.ObjectId(id) }).populate('shop_id', 'shop_name')
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
            const { product_id } = req.body

            const foundProduct = await productModel.findOne({ _id: product_id }).lean()
            if (!foundProduct) throw new BadRequestError({ detail: 'Không tìm thấy sản phẩm' })

            const productThumbImage = foundProduct?.product_thumb_image
            const deleteCloudProductThumbImage = await cloudinary.uploader.destroy(productThumbImage?.public_id as string)
            if (!deleteCloudProductThumbImage) throw new BadRequestError({ detail: 'Xóa product thumb thất bại' })

            const productDescriptionImage = foundProduct?.product_desc_image
            for (let index = 0; index < productDescriptionImage?.length; index++) {
                  const deleteCloudProductDescriptionImageOne = await cloudinary.uploader.destroy(productDescriptionImage[index].public_id)
                  if (!deleteCloudProductDescriptionImageOne)
                        throw new BadRequestError({ detail: `Xóa product description item::${index} thất bại` })
            }
            const deleteProduct = await productModel.findOneAndDelete({ _id: product_id }, { new: true, upsert: true })
            if (!deleteProduct) throw new BadRequestError({ detail: 'Xóa sản phẩm thất bại' })

            return { message: 'Xóa thành công' }
      }
}

export default ProductService
