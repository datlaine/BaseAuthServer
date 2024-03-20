"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = exports.cartModel = exports.cartProductSchema = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';
const cartAdressSchema = new mongoose_1.Schema({
    address_street: { type: String, require: true },
    address_ward: {
        type: {
            code: String,
            text: String
        }
    },
    address_district: {
        type: {
            code: String,
            text: String
        }
    },
    address_province: {
        type: {
            code: String,
            text: String
        }
    },
    address_text: { type: String, require: true },
    type: { type: String, enum: ['Home', 'Company', 'Private'], default: 'Home' }
});
exports.cartProductSchema = new mongoose_1.Schema({
    shop_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop', required: true },
    product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    cart_state: { type: String, enum: ['active', 'pending', 'complete'], default: 'active', required: true },
    quantity: { type: Number, require: true },
    new_quantity: Number,
    isSelect: { type: Boolean, default: false },
    cart_address: cartAdressSchema,
    cart_date: { type: Date, default: Date.now(), required: true }
});
const cartSchema = new mongoose_1.Schema({
    cart_user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    cart_count_product: { type: Number, default: 0 },
    cart_select_all: { type: Boolean, default: false },
    cart_products: [exports.cartProductSchema]
});
exports.cartSchema = cartSchema;
const cartModel = (0, mongoose_1.model)(DOCUMENT_NAME, cartSchema);
exports.cartModel = cartModel;
