"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const response_error_1 = require("../Core/response.error");
const response_success_1 = require("../Core/response.success");
const product_constant_1 = require("../constant/product.constant");
const product_model_1 = __importDefault(require("../models/product.model"));
const shop_model_1 = require("../models/shop.model");
const product_factory_1 = require("../services/product.factory");
const product_service_1 = __importDefault(require("../services/product.service"));
class ProductController {
    static async searchQuery(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.searchQuery(req) }).send(res);
    }
    static async seachNameProduct(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.seachNameProduct(req) }).send(res);
    }
    static async createBaseProductId(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.createBaseProductId(req) }).send(res);
    }
    static async uploadProductThumb(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.uploadProductThumb(req) }).send(res);
    }
    static async uploadProductDescriptionImageOne(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.uploadProductDescriptionImageOne(req) }).send(res);
    }
    static async getProductShop(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getProductShop(req) }).send(res);
    }
    static async deleteProductThumb(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.deleteProductThumb(req) }).send(res);
    }
    static async deleteProductDescriptionImageOne(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.deleteProductDescriptionImageOne(req) }).send(res);
    }
    static async deleteProductImageFull(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.deleteProductImageFull(req) }).send(res);
    }
    static async uploadProductBook(req, res, next) {
        const user_id = req.user?._id;
        const foundShop = await shop_model_1.shopModel.findOne({ owner: user_id });
        console.log({ body: req.body });
        const { product_name, product_price, product_type, product_available } = req.body.uploadProduct;
        const { product_id, mode } = req.body;
        const { author, type, description, page_number, publishing } = req.body.product_attribute;
        // const product_is_bought = product_is_bought || 0
        // const product_is_bought = product_is_bought || 0
        const product_state = true;
        const product_votes = product_constant_1.product_default_vote;
        const product = await product_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(product_id) }).lean();
        if (!product?.product_thumb_image.secure_url || product.product_desc_image.length === 0) {
            throw new response_error_1.BadRequestError({ detail: 'Quá trình upload hình ảnh xảy ra lỗi, vui lòng chọn lại' });
        }
        const book = new product_factory_1.ProductBook({
            _id: new mongoose_1.Types.ObjectId(product_id),
            product_name,
            product_available,
            product_votes,
            product_price,
            totalComment: 0,
            product_is_bought: product?.product_is_bought || 0,
            shop_id: foundShop?._id,
            product_type,
            product_state,
            mode,
            attribute: { publishing, author, description, page_number, product_id: new mongoose_1.Types.ObjectId(product_id), type }
        });
        new response_success_1.OK({ metadata: await product_factory_1.ProductFactory.createProduct(book) }).send(res);
    }
    static async uploadProductFood(req, res, next) {
        console.log({ body: req.body });
        const user_id = req.user?._id;
        const foundShop = await shop_model_1.shopModel.findOne({ owner: user_id });
        const { product_name, product_price, product_type, product_available } = req.body.uploadProduct;
        const { product_id, mode } = req.body;
        const { product_food_Manufacturers_Name, description, product_food_origin, type, product_food_unit } = req.body
            .product_attribute;
        // const product_is_bought = product_is_bought || 0
        const product_state = true;
        const product_votes = product_constant_1.product_default_vote;
        const product = await product_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(product_id) }).lean();
        if (!product?.product_thumb_image.secure_url || product.product_desc_image.length === 0) {
            throw new response_error_1.BadRequestError({ detail: 'Quá trình upload hình ảnh xảy ra lỗi, vui lòng chọn lại' });
        }
        const food = new product_factory_1.ProductFood({
            _id: new mongoose_1.Types.ObjectId(product_id),
            product_name,
            product_available,
            product_votes,
            product_price,
            totalComment: 0,
            product_is_bought: product?.product_is_bought || 0,
            shop_id: foundShop?._id,
            product_type,
            product_state,
            mode,
            attribute: {
                description,
                product_food_Manufacturers_Name,
                product_food_origin,
                type,
                product_food_unit,
                product_id: new mongoose_1.Types.ObjectId(product_id)
            }
        });
        new response_success_1.OK({ metadata: await product_factory_1.ProductFactory.createProduct(food) }).send(res);
    }
    static async getAllProduct(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getAllProduct(req) }).send(res);
    }
    static async getAllProductCare(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getAllProductCare(req) }).send(res);
    }
    static async getProductSimilar(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getProductSimilar(req) }).send(res);
    }
    static async getProductBestBought(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getProductBestBought(req) }).send(res);
    }
    static async getProductBookAllType(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getProductBookAllType(req) }).send(res);
    }
    static async getProductFoodAllType(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getProductFoodAllType(req) }).send(res);
    }
    static async getAllProductWithType(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getAllProductWithType(req) }).send(res);
    }
    static async getProductWithId(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getProductWithId(req) }).send(res);
    }
    static async protectProduct(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.protectProduct(req) }).send(res);
    }
    static async deleteProductWithId(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.deleteProductWithId(req) }).send(res);
    }
    static async getProductFilter(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getProductFilter(req) }).send(res);
    }
    static async getProductTopSearch(req, res, next) {
        new response_success_1.OK({ metadata: await product_service_1.default.getProductTopSearch(req) }).send(res);
    }
}
exports.default = ProductController;
