"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloundinary_config_1 = require("../../configs/cloundinary.config");
const shop_controller_1 = __importDefault(require("../../controllers/shop.controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const shopRouter = (0, express_1.Router)();
//receive -> user_id
shopRouter.get('/get-shop-id', (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.getShopId));
shopRouter.get('/get-shop-has-product', (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.foundShopHasProductType));
shopRouter.get('/get-shop-product', (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.getShopInfoOfProduct));
shopRouter.get('/get-product-best-seller', (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.getProductFilter));
shopRouter.get('/get-shop-admin', (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.getShopAdmin));
shopRouter.use(authentication_1.default);
shopRouter.post('/register-shop', cloundinary_config_1.upload.single('file'), (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.registerShop));
shopRouter.post('/upload-avatar-shop', cloundinary_config_1.upload.single('image'), (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.uploadAvatarShop));
shopRouter.post('/delete-avatar-shop', (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.deleteAvatarShop));
// shopRouter.get('/get-shop-name', asyncHandler(ShopController.getShopName))
shopRouter.get('/get-my-shop', (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.getMyShop));
shopRouter.get('/get-product-my-shop', (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.getProductMyShop));
shopRouter.get('/get-my-order-shop', (0, asyncHandler_1.asyncHandler)(shop_controller_1.default.getOrderMyShop));
exports.default = shopRouter;
