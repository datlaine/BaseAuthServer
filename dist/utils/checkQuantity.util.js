"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkQuanity = void 0;
const mongoose_1 = require("mongoose");
const response_error_1 = require("../Core/response.error");
const product_model_1 = __importDefault(require("../models/product.model"));
const checkQuanity = async ({ products }) => {
    const check = await Promise.all(products.map(async (product) => {
        const checkProducts = await product_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(product.product_id._id) });
        console.log({ product: product.quantity, origin: checkProducts?.product_available });
        if (checkProducts.product_available < Number(product.quantity)) {
            console.log({ error: 'sds' });
            throw new response_error_1.BadRequestError({
                detail: `Sản phẩm ${checkProducts?.product_name} có lượng mua nhiều hơn lượng sản phẩm trong kho`
            });
        }
    }));
    return check;
};
exports.checkQuanity = checkQuanity;
