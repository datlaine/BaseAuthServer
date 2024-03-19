import { Document, Schema, Types, model } from 'mongoose'
import { IProductDoc } from './product.model'

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'shops'

export type Cloudinary = {
      secure_url: string
      public_id: string
}

export type TShop = {
      owner: Types.ObjectId
      shop_name: string
      shop_avatar: Cloudinary
      shop_avatar_used: Cloudinary[]
      shop_avatar_default: string
      shop_products: Types.ObjectId[]
      shop_vote: number
      shop_description: string
      shop_count_total_vote: number
      shop_count_total_product: number
}

export type TShopDoc = TShop & Document

export const shopSchema = new Schema<TShopDoc>(
      {
            owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            shop_name: {
                  type: String,
                  index: true, //---Index----

                  required: true
            },
            shop_avatar: { type: { secure_url: String, public_id: String }, required: true },
            shop_avatar_default: {
                  type: String,
                  default: 'https://res.cloudinary.com/demonodejs/image/upload/v1705389477/static/o5gxkgehijtg9auirdje.jpg'
            },
            shop_avatar_used: {
                  type: [
                        {
                              secure_url: String,
                              public_id: String,
                              date_update: Date
                        }
                  ],
                  default: []
            },
            shop_vote: {
                  type: Number,
                  default: 0,
                  required: true
            },

            shop_count_total_product: {
                  type: Number,
                  default: 0,
                  required: true
            },
            shop_count_total_vote: {
                  type: Number,
                  default: 0,
                  required: true
            },

            shop_description: {
                  type: String,
                  required: true
            },
            shop_products: [{ type: Schema.Types.ObjectId, ref: 'Product', require: true }]
      },
      {
            timestamps: true,
            collection: COLLECTION_NAME
      }
)

shopSchema.index({ shop_name: 'text' })

const DOCUMENT_NAME_PRODUCT_SHOP = 'ProductShop'
const COLLLECTION_NAME_PRODUCT_SHOP = 'productShop'
export type ProductShop = {
      shop_id: Types.ObjectId
      products: [Types.ObjectId]
}

export type ProductShopDoc = ProductShop & Document

export const productShopSchema = new Schema<ProductShopDoc>(
      {
            shop_id: { type: Schema.Types.ObjectId, ref: 'Shop', require: true }
      },
      { timestamps: true, collection: COLLLECTION_NAME_PRODUCT_SHOP }
)

export const productShopModel = model<ProductShopDoc>(DOCUMENT_NAME_PRODUCT_SHOP, productShopSchema)

export const shopModel = model<TShopDoc>(DOCUMENT_NAME, shopSchema)
