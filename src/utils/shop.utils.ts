import { Types } from 'mongoose'
import { shopModel } from '~/models/shop.model'

export const shopProductUnique = async ({ shop_id, product_id }: { shop_id: Types.ObjectId; product_id: Types.ObjectId }) => {
      const shopDocument = await shopModel.findOne({ _id: shop_id })

      if (shopDocument) {
            if (!shopDocument.shop_products.length) {
                  const shop = await shopModel.findOneAndUpdate({ _id: shop_id }, { $push: { shop_products: product_id } })
            } else {
                  const foundProductId = shopDocument.shop_products.findIndex((p) => p?._id === product_id)
                  if (foundProductId === -1) {
                        const shop = await shopModel.findOneAndUpdate({ _id: shop_id }, { $push: { shop_products: product_id } })
                  }
            }
      }
}
