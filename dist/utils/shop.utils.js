"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopProductUnique = void 0;
const shop_model_1 = require("../models/shop.model");
const shopProductUnique = async ({ shop_id, product_id }) => {
    const shopDocument = await shop_model_1.shopModel.findOne({ _id: shop_id });
    if (shopDocument) {
        if (!shopDocument.shop_products.length) {
            const shop = await shop_model_1.shopModel.findOneAndUpdate({ _id: shop_id }, { $push: { shop_products: product_id } });
        }
        else {
            const foundProductId = shopDocument.shop_products.findIndex((p) => p?._id === product_id);
            if (foundProductId === -1) {
                const shop = await shop_model_1.shopModel.findOneAndUpdate({ _id: shop_id }, { $push: { shop_products: product_id } });
            }
        }
    }
};
exports.shopProductUnique = shopProductUnique;
