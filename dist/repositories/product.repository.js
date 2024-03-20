"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("../models/product.model"));
class ProductRepository {
    static async countProductWithType({ product_type }) {
        const result = await product_model_1.default.aggregate([
            {
                $match: { product_type }
            },
            {
                $group: {
                    _id: '$_id',
                    products: { $first: '$$ROOT' },
                    count_type: { $sum: 1 }
                }
            }
        ]);
        return result;
    }
    static async getCategory({ product_type }) {
        const result = await product_model_1.default.aggregate([
            {
                $match: { product_type }
            },
            {
                $project: {
                    category: '$attribute.book_type'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    products: { $first: '$$ROOT' },
                    count_type: { $sum: 1 }
                }
            }
        ]);
    }
    static async getProductDetai({ product_type }) {
        const result = await product_model_1.default.aggregate([
            {
                $match: { product_type }
            },
            // {
            //       $project: {
            //             category: '$attribute.book_type'
            //       }
            // },
            {
                $group: {
                    _id: '$attribute.book_type',
                    products: { $first: '$$ROOT' },
                    count_type: { $sum: 1 }
                }
            }
        ]);
        return result;
    }
}
exports.default = ProductRepository;
