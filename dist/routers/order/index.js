"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("../../controllers/order.controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const orderRouter = (0, express_1.Router)();
orderRouter.use(authentication_1.default);
orderRouter.post('/order-payment-product', (0, asyncHandler_1.asyncHandler)(order_controller_1.default.orderAddProduct));
orderRouter.get('/get-my-order', (0, asyncHandler_1.asyncHandler)(order_controller_1.default.getMyOrder));
orderRouter.post('/buy-again', (0, asyncHandler_1.asyncHandler)(order_controller_1.default.buyAgain));
orderRouter.get('/get-order-info/:order_id', (0, asyncHandler_1.asyncHandler)(order_controller_1.default.getOrderInfo));
exports.default = orderRouter;
