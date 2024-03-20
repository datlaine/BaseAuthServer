"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFood = exports.ProductBook = exports.ProductFactory = void 0;
const mongoose_1 = require("mongoose");
const notification_model_1 = require("../models/notification.model");
const product_model_1 = __importStar(require("../models/product.model"));
const shop_model_1 = require("../models/shop.model");
const notification_util_1 = require("../utils/notification.util");
const shop_utils_1 = require("../utils/shop.utils");
class ProductFactory {
    static productStrategy;
    static async createProduct(product) {
        ProductFactory.productStrategy = product;
        return ProductFactory.productStrategy.createProduct();
    }
}
exports.ProductFactory = ProductFactory;
class Product {
    _id;
    shop_id;
    product_name;
    product_price;
    product_type;
    product_is_bought;
    product_state;
    product_available;
    product_votes;
    attribute;
    constructor({ shop_id, product_name, product_price, attribute, _id, product_type, product_state, product_is_bought, product_available, product_votes }) {
        this.shop_id = shop_id;
        this.product_name = product_name;
        this.product_price = product_price;
        this.product_type = product_type;
        this.attribute = attribute;
        this._id = _id;
        this.product_state = product_state;
        this.product_is_bought = product_is_bought;
        this.product_available = product_available;
        this.product_votes = product_votes;
    }
    async createProduct() {
        console.log({ shop_id: this.shop_id });
        const product = await product_model_1.default.findOneAndUpdate({ _id: this._id }, {
            $set: {
                shop_id: this.shop_id,
                product_name: this.product_name,
                product_price: this.product_price,
                product_is_bought: this.product_is_bought,
                product_type: this.product_type,
                attribute: this.attribute,
                product_state: this.product_state,
                product_available: this.product_available,
                product_votes: this.product_votes,
                isProductFull: true
            }
        }, { new: true, upsert: true });
        return product;
    }
}
class ProductBook extends Product {
    attribute;
    mode;
    shop_id;
    constructor({ _id, shop_id, product_name, product_price, product_type = 'Book', product_is_bought, product_state = true, totalComment = 0, product_available, product_votes, attribute, mode }) {
        super({
            _id,
            shop_id,
            product_name,
            product_price,
            totalComment,
            product_type,
            product_is_bought,
            product_state,
            product_available,
            product_votes,
            attribute
        });
        this.attribute = attribute;
        this.mode = mode;
        this.shop_id = shop_id;
    }
    async createProduct() {
        const createProductBook = await product_model_1.productBookModel.create({
            product_id: this.attribute.product_id,
            author: this.attribute.author,
            publishing: this.attribute.publishing,
            page_number: this.attribute.page_number,
            description: this.attribute.description,
            book_type: this.attribute.type
        });
        console.log({ book: createProductBook });
        const createProduct = await super.createProduct();
        console.log('Book');
        if (createProduct) {
            console.log('system');
            if (this.mode === 'UPLOAD') {
                const productShopQuery = { _id: new mongoose_1.Types.ObjectId(createProduct.shop_id?._id) };
                const product = await product_model_1.default
                    .findOne({ _id: new mongoose_1.Types.ObjectId(createProduct._id) })
                    .populate('shop_id', '_id');
                // const productShopUpdate = { $push: { shop_products: { product_id: new Types.ObjectId(product_id) } } }
                // const productShopOptions = { new: true, upsert: true }
                await (0, shop_utils_1.shopProductUnique)({
                    shop_id: new mongoose_1.Types.ObjectId(product?.shop_id._id),
                    product_id: new mongoose_1.Types.ObjectId(createProduct._id)
                });
                const checkUser = await shop_model_1.shopModel.findOne({ _id: new mongoose_1.Types.ObjectId(this.shop_id) });
                const query = { notification_user_id: new mongoose_1.Types.ObjectId(checkUser?.owner) };
                const update = {
                    $push: {
                        notifications_message: (0, notification_util_1.renderNotificationSystem)('Bạn đã đăng thành công 1 sản phẩm')
                    },
                    $inc: { notification_count: 1 }
                };
                const optionNotification = { new: true, upsert: true };
                await notification_model_1.notificationModel.findOneAndUpdate(query, update, optionNotification);
            }
        }
        return createProduct;
    }
}
exports.ProductBook = ProductBook;
class ProductFood extends Product {
    attribute;
    mode;
    constructor({ _id, shop_id, product_name, product_price, product_type = 'Food', product_is_bought, product_state = true, totalComment = 0, product_available, product_votes, mode, attribute }) {
        super({
            _id,
            shop_id,
            product_name,
            product_price,
            totalComment,
            product_is_bought,
            product_type,
            product_available,
            product_state,
            product_votes,
            attribute
        });
        this.attribute = attribute;
        this.mode = mode;
    }
    async createProduct() {
        const createProductFood = await product_model_1.productFoodModel.create({
            product_id: this.attribute.product_id,
            product_food_Manufacturers_Name: this.attribute.product_food_Manufacturers_Name,
            product_food_origin: this.attribute.product_food_origin,
            product_food_unit: this.attribute.product_food_unit,
            product_food_Date_Of_manufacture: this.attribute.product_id,
            description: this.attribute.description,
            product_food_type: this.attribute.type
        });
        console.log({ food: createProductFood });
        const createProduct = await super.createProduct();
        if (createProduct) {
            console.log('system');
            if (this.mode === 'UPLOAD') {
                const productShopQuery = { _id: new mongoose_1.Types.ObjectId(createProduct.shop_id?._id) };
                const product = await product_model_1.default
                    .findOne({ _id: new mongoose_1.Types.ObjectId(createProduct._id) })
                    .populate('shop_id', '_id');
                // const productShopUpdate = { $push: { shop_products: { product_id: new Types.ObjectId(product_id) } } }
                // const productShopOptions = { new: true, upsert: true }
                await (0, shop_utils_1.shopProductUnique)({
                    shop_id: new mongoose_1.Types.ObjectId(product?.shop_id._id),
                    product_id: new mongoose_1.Types.ObjectId(createProduct._id)
                });
                const checkUser = await shop_model_1.shopModel.findOne({ _id: new mongoose_1.Types.ObjectId(this.shop_id) });
                const query = { notification_user_id: new mongoose_1.Types.ObjectId(checkUser?.owner) };
                const update = {
                    $push: {
                        notifications_message: (0, notification_util_1.renderNotificationSystem)('Bạn đã đăng thành công 1 sản phẩm')
                    },
                    $inc: { notification_count: 1 }
                };
                const optionNotification = { new: true, upsert: true };
                await notification_model_1.notificationModel.findOneAndUpdate(query, update, optionNotification);
            }
        }
        return createProduct;
    }
}
exports.ProductFood = ProductFood;
