import { Document, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

interface CartModel {
      cart_product_id: Types.ObjectId
      cart_user_id: Types.ObjectId
      cart_date: Date
      cart_quantity: number
      cart_is_select: boolean
      cart_product_price: number
      cart_product_price_origin: number
}

type CartModelDoc = CartModel & Document

const cartSchema = new Schema<CartModelDoc>(
      {
            cart_product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            cart_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            cart_quantity: { type: Number, default: 0, required: true },
            cart_product_price: { type: Number, default: 0, required: true },
            cart_product_price_origin: { type: Number, default: 0, required: true },
            cart_is_select: { type: Boolean, default: false },
            cart_date: { type: Date, default: Date.now() }
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const cartModel = model<CartModelDoc>(DOCUMENT_NAME, cartSchema)

export { cartModel, cartSchema }
