import { Document, Schema, Types, model } from 'mongoose'
import { TImage } from './product.model'

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

export type TShop = {
      owner: Types.ObjectId
      shop_name: string
      shop_avatar: TImage
      shop_avatar_used: TImage[]
      shop_avartar_default: string
}

export type TShopDoc = TShop & Document

export const shopSchema = new Schema<TShopDoc>(
      {
            owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            shop_name: { type: String, required: true },
            shop_avatar: { type: { secure_url: String, public_id: String }, required: true },
            shop_avartar_default: {
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

export const shopModel = model<TShopDoc>(DOCUMENT_NAME, shopSchema)
