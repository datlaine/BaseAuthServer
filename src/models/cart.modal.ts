import { Document, ObjectId, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

// interface CartModel {
//       cart_product_id: Types.ObjectId
//       cart_user_id: Types.ObjectId
//       cart_date: Date
//       cart_quantity: number
//       cart_is_select: boolean
//       cart_product_price: number
//       cart_product_price_origin: number
// }

type CartState = ['active', 'pending', 'complete']

export interface CartProduct {
      shop_id: Types.ObjectId
      product_id: Types.ObjectId
      product_name: string
      product_price: number
      cart_state: 'active' | 'pending' | 'complete'

      quantity: number
      new_quantity: number
      isSelect: boolean
      cart_date: Date
}

interface CartModel {
      cart_user_id: Types.ObjectId
      cart_products: Types.DocumentArray<CartProduct>
      cart_count_product: number
}

type CartModelDoc = CartModel & Document
type CartProductDoc = CartProduct & Document

// const cartSchema = new Schema<CartModelDoc>(
//       {
//             cart_product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
//             cart_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//             cart_quantity: { type: Number, default: 0, required: true },
//             cart_product_price: { type: Number, default: 0, required: true },
//             cart_product_price_origin: { type: Number, default: 0, required: true },
//             cart_is_select: { type: Boolean, default: false },
//             cart_date: { type: Date, default: Date.now() }
//       },
//       { collection: COLLECTION_NAME, timestamps: true }
// )

const cartSchema = new Schema<CartModelDoc>({
      cart_user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
      },
      cart_count_product: { type: Number, default: 0 },
      cart_products: [
            new Schema<CartProductDoc>({
                  shop_id: { type: Schema.Types.ObjectId, ref: 'Shop' },

                  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
                  product_name: String,
                  product_price: String,
                  cart_state: { type: String, enum: ['active', 'pending', 'complete'], default: 'active' },
                  quantity: Number,
                  new_quantity: Number,
                  cart_date: Date,
                  isSelect: { type: Boolean, default: false }
            })
      ]
})

const cartModel = model<CartModelDoc>(DOCUMENT_NAME, cartSchema)

export { cartModel, cartSchema }
