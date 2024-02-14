import { Document, Schema, Types, model } from 'mongoose'
import { TComment } from './comment.model'

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'products'

export interface IProductBook {
      product_id: Types.ObjectId
      publishing: string
      author: string
      page_number: number
      description: string
}

export interface IProductBookDoc extends IProductBook, Document {}
export type TImage = {
      secure_url: string
      public_id: string
}
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
      product_quantity: number
      // product_votes: number
      // product_comment: TComment[]
      isProductFull?: boolean
      expireAt?: Date
      attribute: IProductBook
}

export type IProductDoc = IProduct & Document

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
            isProductFull: { type: Boolean, default: false },

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
            product_quantity: { type: Number, required: true },
            // product_votes: { type: Number, required: true },
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

const productModel = model<IProductDoc>(DOCUMENT_NAME, productSchema)

export const bookSchema = new Schema<IProductBookDoc>(
      {
            publishing: { type: String, required: true },
            author: { type: String, required: true },
            page_number: { type: Number, required: true },
            description: { type: String, required: true },
            product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true }
      },
      { timestamps: true, collection: 'books' }
)

export const productBookModel = model<IProductBookDoc>('Books', bookSchema)

export default productModel
