import mongoose, { Document, ObjectId, Schema, Types, UpdateWriteOpResult } from 'mongoose'
import productModel, { IProduct, IProductBook, IProductDoc, productBookModel } from '~/models/product.model'

interface IProductStrategy {
      createProduct: () => Promise<UpdateWriteOpResult>
}

export class ProductFactory {
      static productStrategy: IProductStrategy

      static async createProduct(product: IProductStrategy) {
            ProductFactory.productStrategy = product
            return ProductFactory.productStrategy.createProduct()
      }
}

class Product implements IProductStrategy {
      private _id: Types.ObjectId
      private user_id: Types.ObjectId
      private product_name: string
      private product_price: number
      private product_desc_image: { secure_url: string; public_id: string }[]
      private product_thumb_image: { secure_url: string; public_id: string }
      protected product_type: string
      protected attribute: IProductBook
      constructor({
            user_id,
            product_name,
            product_price,
            product_desc_image,
            product_thumb_image,
            attribute,
            _id,
            product_type
      }: IProduct & { _id: Types.ObjectId }) {
            this.user_id = user_id
            this.product_name = product_name
            this.product_price = product_price
            this.product_thumb_image = product_thumb_image as { secure_url: string; public_id: string }
            this.product_desc_image = product_desc_image as { secure_url: string; public_id: string }[]
            this.product_type = product_type
            this.attribute = attribute
            this._id = _id
      }

      async createProduct() {
            return await productModel.updateOne(
                  { _id: this._id },
                  {
                        $set: {
                              product_name: this.product_name,
                              product_price: this.product_price,
                              product_thumb_image: {
                                    secure_url: this.product_thumb_image.secure_url,
                                    public_id: this.product_thumb_image.public_id
                              },
                              product_type: this.product_type,
                              attribute: this.attribute,
                              isProductFull: true
                        }
                  },
                  { new: true, upsert: true }
            )
      }
}

export class ProductBook extends Product implements IProductStrategy {
      constructor({
            _id,
            user_id,
            product_name,
            product_price,
            product_desc_image,
            product_thumb_image,
            attribute,
            product_type = 'Book'
      }: IProduct & { _id: Types.ObjectId }) {
            super({ user_id, product_name, product_price, product_thumb_image, product_desc_image, attribute, product_type, _id })
            this.product_type = product_type
            this.attribute = attribute
      }

      async createProduct() {
            const createProductBook = await productBookModel.create({
                  product_id: this.attribute.product_id,
                  author: this.attribute.author,
                  publishing: this.attribute.publishing,
                  page_number: this.attribute.page_number,
                  description: this.attribute.description
            })

            console.log({ book: createProductBook })
            const createProduct = await super.createProduct()
            return createProduct
      }
}
