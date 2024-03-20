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
}
exports.default = ShopRepository;
