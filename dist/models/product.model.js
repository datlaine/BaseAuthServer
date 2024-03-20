"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFoodModel = exports.productBookModel = exports.Vacation = exports.productFoodSchema = exports.bookSchema = exports.productSchema = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'products';
exports.productSchema = new mongoose_1.Schema({
    shop_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Shop',
        require: true
    },
    product_name: {
        type: String,
        default: 'none',
        index: true, //---Index----
        required: true
    },
    product_price: { type: Number, default: 0, required: true },
    product_thumb_image: {
        type: {
            secure_url: String,
            public_id: String
        },
        required: true
    },
    product_desc_image: {
        type: [
            {
                secure_url: String,
                public_id: String
            }
        ],
        required: true
    },
    isProductFull: { type: Boolean, default: false, require: true },
    expireAt: {
        type: Date,
        default: Date.now,
        index: {
            expireAfterSeconds: 100,
            partialFilterExpression: { isProductFull: false }
        }
    },
    product_type: { type: String, enum: ['Book', 'Food'], require: true },
    product_is_bought: { type: Number, required: true },
    product_state: { type: Boolean, default: false },
    product_votes: { type: Number, required: true },
    product_available: { type: Number, require: true },
    product_date_create: { type: Date, default: Date.now },
    // product_comment: {
    //       type: [{ product_comment_id: Schema.Types.ObjectId, ref: 'Comment' }],
    //       default: []
    // },
    attribute: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true
    },
    totalComment: { type: Number, default: 0 }
}, { timestamps: true, collection: COLLECTION_NAME });
exports.productSchema.index({ product_name: 'text' });
exports.bookSchema = new mongoose_1.Schema({
    publishing: { type: String, required: true },
    author: { type: String, required: true },
    page_number: { type: Number, required: true },
    description: { type: String, required: true },
    product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['Novel', 'Manga', 'Detective'], require: true }
}, { timestamps: true, collection: 'books' });
exports.productFoodSchema = new mongoose_1.Schema({
    product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    product_food_Manufacturers_Name: { type: String, required: true },
    product_food_origin: { type: String, required: true },
    product_food_unit: { type: String, enum: ['Kilogram', 'Box'], default: 'Kilogram', required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Fast food', 'Canned Goods', 'Drinks'], require: true }
}, { timestamps: true, collection: 'foods' });
exports.Vacation = new mongoose_1.Schema({
    publishing: { type: String, required: true },
    author: { type: String, required: true },
    page_number: { type: Number, required: true },
    description: { type: String, required: true },
    product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['Novel', 'Manga', 'Detective'], require: true }
}, { timestamps: true, collection: 'books' });
const productModel = (0, mongoose_1.model)(DOCUMENT_NAME, exports.productSchema);
exports.productBookModel = (0, mongoose_1.model)('Books', exports.bookSchema);
exports.productFoodModel = (0, mongoose_1.model)('Foods', exports.productFoodSchema);
exports.default = productModel;
