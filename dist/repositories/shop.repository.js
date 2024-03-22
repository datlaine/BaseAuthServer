"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = require("../models/order.model");
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
        const result = await order_model_1.orderModel.aggregate([
            { $unwind: '$order_products' }, // Phân rã mảng order_products thành các tài liệu riêng lẻ
            { $match: { 'order_products.products.shop_id': shop_id } }, // Lọc các tài liệu dựa trên shop_id
            {
                $group: {
                    _id: '$_id',
                    order_user_id: { $first: '$order_user_id' },
                    order_time: { $first: '$order_time' },
                    order_products: { $push: '$order_products' }
                } // Nhóm lại các tài liệu để biến chúng trở lại dạng mảng order_products
            },
            { $skip: skip }, // Bỏ qua các tài liệu trên các trang trước
            { $limit: limit }, // Giới hạn số lượng tài liệu trên trang
            {
                $lookup: {
                    from: 'products', // Tên của collection bạn muốn tham chiếu đến
                    localField: 'order_products.products.product_id', // Trường trong bộ sưu tập hiện tại
                    foreignField: '_id', // Trường trong bộ sưu tập tham chiếu đến
                    as: 'order_products.products' // Tên của mảng mới chứa kết quả từ lookup
                }
            },
            {
                $addFields: {
                    'order_products.products': '$order_products.products'
                }
            }
        ]);
        return result[0];
    }
}
exports.default = ShopRepository;
