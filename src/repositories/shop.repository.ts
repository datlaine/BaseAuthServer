import { Types } from 'mongoose'
import { shopModel } from '~/models/shop.model'

class ShopRepository {
      static async getTotalCommentAndVote({ shop_id }: { shop_id: Types.ObjectId }) {
            const result = await shopModel.aggregate([
                  { $match: { _id: shop_id } },
                  { $unwind: '$shop_products' },

                  {
                        $lookup: {
                              from: 'products',
                              localField: 'shop_products',
                              foreignField: '_id',
                              as: 'product'
                        }
                  },

                  { $unwind: '$product' },

                  {
                        $group: {
                              _id: null,
                              shop_vote: { $avg: '$product.product_votes' },
                              shop_total_comment: { $sum: '$product.totalComment' }
                        }
                  }
            ])
            return result[0]
      }
}

export default ShopRepository
