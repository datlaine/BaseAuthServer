import mongoose, { Document, ObjectId, Schema, Types, UpdateWriteOpResult } from 'mongoose'
import productModel, { IProduct, IProductBook, IProductDoc, productBookModel } from '~/models/product.model'

interface IProductStrategy {
      createProduct: () => Promise<
            mongoose.Document<unknown, {}, IProductDoc> &
                  IProduct &
                  mongoose.Document<any, any, any> & {
                        _id: Types.ObjectId
                  }
      >
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
      protected product_type: string
      private product_is_bought: number
      private product_state: boolean
      private product_available: number
      private product_votes: number
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
            product_available,
            product_votes
      }: TProduct & { _id: Types.ObjectId }) {
            this.shop_id = shop_id
            this.product_name = product_name
            this.product_price = product_price
            this.product_type = product_type
            this.attribute = attribute
            this._id = _id
            this.product_state = product_state
            this.product_is_bought = product_is_bought
            this.product_available = product_available
            this.product_votes = product_votes
      }

      async createProduct() {
            console.log({ shop_id: this.shop_id })

            return await productModel.findOneAndUpdate(
                  { _id: this._id },
                  {
                        $set: {
                              shop_id: this.shop_id,
                              product_name: this.product_name,
                              product_price: this.product_price,
                              product_is_bought: this.product_is_bought,
                              product_type: this.product_type,
                              attribute: this.attribute,
                              product_state: this.product_state,
                              product_available: this.product_available,
                              product_votes: this.product_votes,

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
            product_type = 'Book',
            product_is_bought,
            product_state = true,
            product_available,
            product_votes,
            attribute
      }: TProduct & { _id: Types.ObjectId }) {
            super({
                  shop_id,
                  product_name,
                  product_price,
                  attribute,
                  product_type,
                  _id,
                  product_is_bought,
                  product_state,
                  product_available,
                  product_votes
            })
            this.attribute = attribute
      }

      async createProduct() {
            const createProductBook = await productBookModel.create({
                  product_id: this.attribute.product_id,
                  author: this.attribute.author,
                  publishing: this.attribute.publishing,
                  page_number: this.attribute.page_number,
                  description: this.attribute.description,
                  book_type: this.attribute.book_type
            })

            console.log({ book: createProductBook })
            const createProduct = await super.createProduct()
            return createProduct
      }
}
