import { Document, ObjectId, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

export type Address = {
      address_street: string
      address_ward: {
            code: string
            text: string
      }
      address_district: {
            code: string
            text: string
      }
      address_province: {
            code: string
            text: string
      }
      address_text: string

      type: 'Home' | 'Company' | 'Private'
}

export interface CartProduct {
      shop_id: Types.ObjectId
      product_id: Types.ObjectId
      cart_state: 'active' | 'pending' | 'complete'

      quantity: number
      new_quantity: number
      isSelect: boolean
      cart_date: Date
      cart_address: Address
}

export interface CartProductWithId {
      _id: Types.ObjectId
      shop_id: Types.ObjectId
      product_id: Types.ObjectId
      cart_state: 'active' | 'pending' | 'complete'

      quantity: number
      new_quantity: number
      isSelect: boolean
      cart_date: Date
      cart_address: Address
}

interface CartModel {
      cart_user_id: Types.ObjectId
      cart_products: Types.DocumentArray<CartProduct>
      cart_count_product: number
      cart_select_all: boolean
}

type CartModelDoc = CartModel & Document
type CartProductDoc = CartProduct & Document

const cartAdressSchema = new Schema({
      address_street: { type: String, require: true },
      address_ward: {
            type: {
                  code: String,
                  text: String
            }
      },
      address_district: {
            type: {
                  code: String,
                  text: String
            }
      },
      address_province: {
            type: {
                  code: String,
                  text: String
            }
      },
      address_text: { type: String, require: true },

      type: { type: String, enum: ['Home', 'Company', 'Private'], default: 'Home' }
})

export const cartProductSchema = new Schema<CartProductDoc>({
      shop_id: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },

      product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      cart_state: { type: String, enum: ['active', 'pending', 'complete'], default: 'active', required: true },
      quantity: { type: Number, require: true },
      new_quantity: Number,
      isSelect: { type: Boolean, default: false },
      cart_address: cartAdressSchema,
      cart_date: { type: Date, default: Date.now(), required: true }
})

cartProductSchema.virtual('product', {
      ref: 'Product',
      localField: 'product_id',
      foreignField: '_id',
      justOne: true
})

const cartSchema = new Schema<CartModelDoc>({
      cart_user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
      },
      cart_count_product: { type: Number, default: 0 },
      cart_select_all: { type: Boolean, default: false },
      cart_products: [cartProductSchema]
})

const cartModel = model<CartModelDoc>(DOCUMENT_NAME, cartSchema)

export { cartModel, cartSchema }
