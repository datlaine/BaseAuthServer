import { Document, Schema, Types, model } from 'mongoose'
import { TComment } from './comment.model'

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'products'

export interface IProductBookDoc extends IProductBook, Document {}
export interface IProductFoodDoc extends IProductFood, Document {}
export type IProductDoc = IProduct & Document

export interface IProduct {
      shop_id: Types.ObjectId
      product_name: string
      product_price: number
      product_thumb_image: {
            secure_url: string
            public_id: string
      }

      product_desc_image: {
            secure_url: string
            public_id: string
      }[]
      product_type: string
      product_is_bought: number

      product_state: boolean
      product_votes: number
      product_available: number

      // product_comment: TComment[]
      isProductFull?: boolean
      expireAt?: Date
      attribute: IProductBook | IProductFood
}

export const productSchema = new Schema<IProductDoc>(
      {
            shop_id: {
                  type: Schema.Types.ObjectId,
                  ref: 'Shop',
                  require: true
            },
            product_name: { type: String, default: 'none', required: true },
            product_price: { type: Number, default: 0, required: true },
            product_thumb_image: {
                  type: {
                        secure_url: String,
                        public_id: String
                  },
                  required: true
            },

            product_desc_image: {
                  type: [
                        {
                              secure_url: String,
                              public_id: String
                        }
                  ],
                  required: true
            },
            isProductFull: { type: Boolean, default: false, require: true },

            expireAt: {
                  type: Date,
                  default: Date.now,
                  index: {
                        expireAfterSeconds: 100,
                        partialFilterExpression: { isProductFull: false }
                  }
            },

            product_type: { type: String, enum: ['Book', 'Food'], require: true },

            product_is_bought: { type: Number, required: true },
            product_state: { type: Boolean, default: false },
            product_votes: { type: Number, required: true },
            product_available: { type: Number, require: true },
            // product_comment: {
            //       type: [{ product_comment_id: Schema.Types.ObjectId, ref: 'Comment' }],
            //       default: []
            // },
            attribute: {
                  type: Schema.Types.Mixed,
                  required: true
            }
      },
      { timestamps: true, collection: COLLECTION_NAME }
)

//@ product - Books
export interface IProductBook {
      product_id: Types.ObjectId
      publishing: string
      author: string
      page_number: number
      description: string
      book_type: 'Novel' | 'Manga' | 'Detective'
}

export const bookSchema = new Schema<IProductBookDoc>(
      {
            publishing: { type: String, required: true },
            author: { type: String, required: true },
            page_number: { type: Number, required: true },
            description: { type: String, required: true },
            product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            book_type: { type: String, enum: ['Novel', 'Manga', 'Detective'], require: true }
      },
      { timestamps: true, collection: 'books' }
)

//@ product - Food
export interface IProductFood {
      product_id: Types.ObjectId
      product_food_Manufacturers_Name: string
      product_food_origin: string
      product_food_unit: 'Kilogram' | 'Box'

      description: string
      product_food_type: 'Fast food' | 'Canned Goods' | 'Drinks'
}

export const productFoodSchema = new Schema<IProductFoodDoc>(
      {
            product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },

            product_food_Manufacturers_Name: { type: String, required: true },
            product_food_origin: { type: String, required: true },
            product_food_unit: { type: String, enum: ['Kilogram', 'Box'], default: 'Kilogram', required: true },
            description: { type: String, required: true },
            product_food_type: { type: String, enum: ['Fast food', 'Canned Goods', 'Drinks'], require: true }
      },
      { timestamps: true, collection: 'foods' }
)

export const Vacation = new Schema<IProductBookDoc>(
      {
            publishing: { type: String, required: true },
            author: { type: String, required: true },
            page_number: { type: Number, required: true },
            description: { type: String, required: true },
            product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            book_type: { type: String, enum: ['Novel', 'Manga', 'Detective'], require: true }
      },
      { timestamps: true, collection: 'books' }
)
const productModel = model<IProductDoc>(DOCUMENT_NAME, productSchema)
export const productBookModel = model<IProductBookDoc>('Books', bookSchema)
export const productFoodModel = model<IProductFoodDoc>('Foods', productFoodSchema)

export default productModel
