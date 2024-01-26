import { Document, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'products'

export interface IProductDoc extends Document {
      user_id: Types.ObjectId
      product_name: string
      product_price: number
      product_thumb_image: string
}

export const productSchema = new Schema<IProductDoc>(
      {
            user_id: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  require: true
            },
            product_name: { type: String, default: 'none', required: true },
            product_price: { type: Number, default: 0, required: true },
            product_thumb_image: { type: String, default: 'none', required: true }
      },
      { timestamps: true, collection: COLLECTION_NAME }
)
productSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

const productModel = model<IProductDoc>(DOCUMENT_NAME, productSchema)

export default productModel
