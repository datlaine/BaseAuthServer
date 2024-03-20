"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopModel = exports.productShopModel = exports.productShopSchema = exports.shopSchema = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'shops';
exports.shopSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    shop_name: {
        type: String,
        index: true, //---Index----
        required: true
    },
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
    },
    shop_vote: {
        type: Number,
        default: 0,
        required: true
    },
    shop_count_total_product: {
        type: Number,
        default: 0,
        required: true
    },
    shop_count_total_vote: {
        type: Number,
        default: 0,
        required: true
    },
    shop_description: {
        type: String,
        required: true
    },
    shop_products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', require: true }]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
exports.shopSchema.index({ shop_name: 'text' });
const DOCUMENT_NAME_PRODUCT_SHOP = 'ProductShop';
const COLLLECTION_NAME_PRODUCT_SHOP = 'productShop';
exports.productShopSchema = new mongoose_1.Schema({
    shop_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop', require: true }
}, { timestamps: true, collection: COLLLECTION_NAME_PRODUCT_SHOP });
exports.productShopModel = (0, mongoose_1.model)(DOCUMENT_NAME_PRODUCT_SHOP, exports.productShopSchema);
exports.shopModel = (0, mongoose_1.model)(DOCUMENT_NAME, exports.shopSchema);
