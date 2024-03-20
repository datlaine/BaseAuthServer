"use strict";
// db.orders.aggregate([
//   {
//     $unwind: "$order_products"
//   },
//   {
//     $unwind: "$order_products.products"
//   },
//   {
//     $match: {
//       "order_products.products._id": ObjectId('65df2c3d8b9cb481c84fadc8')
//     }
//   },
//   {
//     $project: {
//       "product": "$order_products.products"
//     }
//   }
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const order_model_1 = require("../models/order.model");
// ])
class OrderRepository {
    static async getOrderWitId({ order_products_products_id }) {
        const orderProductsId = await order_model_1.orderModel.aggregate([
            //@ phân rã mảng ra nhiều mảng con
            {
                $unwind: '$order_products'
            },
            {
                $unwind: '$order_products.products'
            },
            //@ điều kiện
            {
                $match: {
                    'order_products._id': new mongoose_1.Types.ObjectId(order_products_products_id)
                }
            },
            //Chọn field đổi
            {
                $project: {
                    product: '$order_products.products'
                }
            },
            // giống populate
            {
                $lookup: {
                    from: 'products',
                    localField: 'product.product_id',
                    foreignField: '_id',
                    as: 'product_doc'
                }
            },
            //chọn field
            {
                $project: {
                    product: 1,
                    product_doc: { $arrayElemAt: ['$product_doc', 0] } // Chỉ lấy phần tử đầu tiên
                }
            }
        ]);
        console.log({ product: orderProductsId });
        return orderProductsId;
    }
}
exports.default = OrderRepository;
// db.orders.aggregate([
//   {
//     $unwind: "$order_products"
//   },
//   {
//     $unwind: "$order_products.products"
//   },
//   {
//     $match: {
//       "order_products.products._id": ObjectId("65e0345901f228eb9756b098")
//     }
//   },
//   {
//     $project: {
//       "product": "$order_products.products"
//     }
//   }
// ])
