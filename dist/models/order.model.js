"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = require("mongoose");
const cart_modal_1 = require("./cart.modal");
const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';
const orderItemSchema = new mongoose_1.Schema({
    _id: mongoose_1.Types.ObjectId,
    products: [cart_modal_1.cartProductSchema],
    order_time_payment: { type: Date, default: Date.now },
    order_total: { type: Number, required: true }
});
const schemaOrder = new mongoose_1.Schema({
    order_user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    order_time: { type: Date, default: Date.now() },
    order_products: [orderItemSchema]
}, { collection: COLLECTION_NAME, timestamps: true });
exports.orderModel = (0, mongoose_1.model)(DOCUMENT_NAME, schemaOrder);
