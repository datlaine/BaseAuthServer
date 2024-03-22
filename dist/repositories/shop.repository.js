"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shop_model_1 = require("../models/shop.model");
class ShopRepository {
    static async getTotalCommentAndVote({ shop_id }) {
        const result = await shop_model_1.shopModel.aggregate([
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
        ]);
        return result[0];
    }
    static async getMyOrderShop({ shop_id, skip, limit }) {
        const result = await shop_model_1.shopModel.aggregate([
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
        ]);
        return result;
    }
}
exports.default = ShopRepository;
