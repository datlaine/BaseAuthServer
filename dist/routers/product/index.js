"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloundinary_config_1 = require("../../configs/cloundinary.config");
const product_controller_1 = __importDefault(require("../../controllers/product.controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const productRouter = (0, express_1.Router)();
productRouter.get('/get-all-product-category', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getAllProductWithType));
productRouter.get('/get-all-product', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getAllProduct));
productRouter.get('/get-product/:id', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getProductWithId));
productRouter.get('/get-product/:id', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getProductWithId));
productRouter.get('/get-product-filter', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getProductFilter));
productRouter.get('/get-product-shop-name', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.searchQuery));
productRouter.get('/get-product-care', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getAllProductCare));
productRouter.get('/get-product-similar', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getProductSimilar));
productRouter.get('/get-product-book-all-type', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getProductBookAllType));
productRouter.get('/get-product-food-all-type', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getProductFoodAllType));
productRouter.get('/get-product-best-bought', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getProductBestBought));
productRouter.get('/get-product-name', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.seachNameProduct));
productRouter.get('/get-product-top-search', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getProductTopSearch));
productRouter.use(authentication_1.default);
productRouter.get('/protect-product/:product_id', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.protectProduct));
productRouter.post('/create-base-product-id', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.createBaseProductId));
productRouter.post('/upload-product-thumb', cloundinary_config_1.upload.single('file'), (0, asyncHandler_1.asyncHandler)(product_controller_1.default.uploadProductThumb));
productRouter.post('/upload-product-description-image-one', cloundinary_config_1.upload.single('file'), (0, asyncHandler_1.asyncHandler)(product_controller_1.default.uploadProductDescriptionImageOne));
productRouter.post('/delete-product-description-image-one', cloundinary_config_1.upload.single('file'), (0, asyncHandler_1.asyncHandler)(product_controller_1.default.deleteProductDescriptionImageOne));
productRouter.post('/upload-product-book', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.uploadProductBook));
productRouter.post('/upload-product-food', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.uploadProductFood));
productRouter.get('/shop-product-all', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.getProductShop));
productRouter.post('/delete-product-thumb', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.deleteProductThumb));
productRouter.post('/delete-product-image-full', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.deleteProductImageFull));
// productRouter.post('/upload-product-images-full', upload.array('files'), asyncHandler(ProductController.uploadProductImageFull))
// productRouter.post('/update-product-images-full', upload.array('files'), asyncHandler(ProductController.updateProductImageFull))
productRouter.delete('/delete-product/:product_id', (0, asyncHandler_1.asyncHandler)(product_controller_1.default.deleteProductWithId));
exports.default = productRouter;
