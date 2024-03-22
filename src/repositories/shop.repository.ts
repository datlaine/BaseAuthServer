import { Types } from 'mongoose'
import { orderModel } from '~/models/order.model'
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

      static async getMyOrderShop({ shop_id, skip, limit }: { shop_id: Types.ObjectId; skip: number; limit: number }) {
            const result = await shopModel.aggregate([
                  { $match: { _id: shop_id } },
                  { $unwind: '$shop_order' },
                  {
                        $lookup: {
                              from: 'products',
                              localField: 'shop_order.product_id',
                              foreignField: '_id',
                              as: 'shop_order.product'
                        }
                  },
                  { $unwind: '$shop_order.product' },
                  {
                        $project: {
                              'shop_order.product_id': 1,
                              'shop_order.product._id': 1,
                              'shop_order.product.product_thumb_image': 1,
                              'shop_order.product.product_name': 1,
                              'shop_order.product.product_votes': 1,
                              'shop_order.product.product_price': 1
                        }
                  },
                  { $skip: skip },
                  { $limit: limit }
            ])

            return result
      }
}

export default ShopRepository
