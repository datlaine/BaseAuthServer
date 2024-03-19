import { Schema, Types, model } from 'mongoose'
import { CartProduct, cartProductSchema } from './cart.modal'
import { Document } from 'mongoose'

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

export interface Order {
      order_user_id: Types.ObjectId
      order_time: Date
      order_products: {
            _id: Types.ObjectId
            products: Types.DocumentArray<CartProduct>
            order_time_payment: Date
            order_total: number
      }[]
}

export type OrderDoc = Order & Document

const orderItemSchema = new Schema({
      _id: Types.ObjectId,
      products: [cartProductSchema],
      order_time_payment: { type: Date, default: Date.now },
      order_total: { type: Number, required: true }
})

const schemaOrder = new Schema<OrderDoc>(
      {
            order_user_id: { type: Schema.Types.ObjectId, ref: 'User' },
            order_time: { type: Date, default: Date.now() },
            order_products: [orderItemSchema]
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

export const orderModel = model<OrderDoc>(DOCUMENT_NAME, schemaOrder)
