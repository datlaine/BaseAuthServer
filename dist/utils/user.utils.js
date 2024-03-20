"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProductSeeUnique = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const userProductSeeUnique = async ({ user_id, product_id }) => {
    const userDocument = await user_model_1.default.findOne({ _id: user_id });
    if (userDocument) {
        if (!userDocument.product_see.length) {
            const user = await user_model_1.default.findOneAndUpdate({ _id: user_id }, { $push: { product_see: product_id } });
        }
        else {
            const foundProductId = userDocument.product_see.findIndex((p) => p.toString() === product_id.toString());
            console.log({ foundProductId });
            if (foundProductId === -1) {
                const user = await user_model_1.default.findOneAndUpdate({ _id: user_id }, { $push: { product_see: product_id } });
            }
        }
    }
};
exports.userProductSeeUnique = userProductSeeUnique;
