import { Document, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

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
}

export type TShopDoc = TShop & Document

export const shopSchema = new Schema<TShopDoc>(
      {
            owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            shop_name: { type: String, required: true },
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
            }
      },
      {
            timestamps: true,
            collection: COLLECTION_NAME
      }
)

const DOCUMENT_NAME_PRODUCT_SHOP = 'ProductShop'
const COLLLECTION_NAME_PRODUCT_SHOP = 'productShop'
export type ProductShop = {
      shop_id: Types.ObjectId
      products: [Types.ObjectId]
}

export type ProductShopDoc = ProductShop & Document

export const productShopSchema = new Schema<ProductShopDoc>(
      {
            shop_id: { type: Schema.Types.ObjectId, ref: 'Shop', require: true },
            products: [
                  new Schema({
                        product_id: { type: Schema.Types.ObjectId, ref: 'Product', require: true },
                        state: { type: String, enum: ['Active', 'Delete', 'Blocck'], default: 'Active', require: true }
                  })
            ]
      },
      { timestamps: true, collection: COLLLECTION_NAME_PRODUCT_SHOP }
)

export const productShopModel = model<ProductShopDoc>(DOCUMENT_NAME_PRODUCT_SHOP, productShopSchema)

export const shopModel = model<TShopDoc>(DOCUMENT_NAME, shopSchema)
