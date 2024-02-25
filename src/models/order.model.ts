import { Schema, Types, model } from 'mongoose'
import { CartProduct, cartProductSchema } from './cart.modal'
import { Document } from 'mongoose'

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

export interface Order {
      order_user_id: Types.ObjectId
      order_time: Date
      order_products: Types.DocumentArray<CartProduct>
}

export type OrderDoc = Order & Document

const schemaOrder = new Schema<OrderDoc>(
      {
            order_user_id: { type: Schema.Types.ObjectId, ref: 'User' },
            order_time: { type: Date, default: Date.now() },
            order_products: [cartProductSchema]
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

export const orderModel = model<OrderDoc>(DOCUMENT_NAME, schemaOrder)
