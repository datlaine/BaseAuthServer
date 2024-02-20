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

type TProduct = Omit<Omit<IProduct, 'product_desc_image'>, 'product_thumb_image'>

class Product implements IProductStrategy {
      private _id: Types.ObjectId
      private shop_id: Types.ObjectId
      private product_name: string
      private product_price: number
      // private product_desc_image: { secure_url: string; public_id: string }[]
      // private product_thumb_image: { secure_url: string; public_id: string }
      protected product_type: string
      private product_is_bought: number
      private product_quantity: number
      private product_state: boolean
      protected attribute: IProductBook
      constructor({
            shop_id,
            product_name,
            product_price,
            attribute,
            _id,
            product_type,
            product_state,
            product_is_bought,
            product_quantity
      }: TProduct & { _id: Types.ObjectId }) {
            this.shop_id = shop_id
            this.product_name = product_name
            this.product_price = product_price
            this.product_type = product_type
            this.attribute = attribute
            this._id = _id
            this.product_state = product_state
            this.product_is_bought = product_is_bought
            this.product_quantity = product_quantity
      }

      async createProduct() {
            console.log({ shop_id: this.shop_id })

            return await productModel.updateOne(
                  { _id: this._id },
                  {
                        $set: {
                              shop_id: this.shop_id,
                              product_name: this.product_name,
                              product_price: this.product_price,
                              product_is_bought: this.product_is_bought,
                              product_quantity: this.product_quantity,
                              product_type: this.product_type,
                              attribute: this.attribute,
                              product_state: this.product_state,

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
            shop_id,
            product_name,
            product_price,
            attribute,
            product_type = 'Book',
            product_is_bought,
            product_quantity,
            product_state = true
      }: TProduct & { _id: Types.ObjectId }) {
            super({
                  shop_id,
                  product_name,
                  product_price,
                  attribute,
                  product_type,
                  _id,
                  product_is_bought,
                  product_quantity,
                  product_state
            })
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
