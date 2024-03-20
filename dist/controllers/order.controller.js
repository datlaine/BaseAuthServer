"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const order_service_1 = __importDefault(require("../services/order.service"));
class OrderController {
    static async orderAddProduct(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await order_service_1.default.orderAddProduct(req) }).send(res);
    }
    static async getMyOrder(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await order_service_1.default.getMyOrder(req) }).send(res);
    }
    static async buyAgain(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await order_service_1.default.buyAgain(req) }).send(res);
    }
    static async getOrderInfo(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await order_service_1.default.getOrderInfo(req) }).send(res);
    }
}
exports.default = OrderController;
