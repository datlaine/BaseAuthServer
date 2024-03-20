"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const cart_service_1 = __importDefault(require("../services/cart.service"));
class CartController {
    static async addcart(req, res, next) {
        new response_success_1.OK({ metadata: await cart_service_1.default.addCart(req) }).send(res);
    }
    static async getCountProductCart(req, res, next) {
        new response_success_1.OK({ metadata: await cart_service_1.default.getCountProductCart(req) }).send(res);
    }
    static async getMyCart(req, res, next) {
        new response_success_1.OK({ metadata: await cart_service_1.default.getMyCart(req) }).send(res);
    }
    static async changeQuantityProductCart(req, res, next) {
        new response_success_1.OK({ metadata: await cart_service_1.default.changeQuantityProductCart(req) }).send(res);
    }
    static async selectAllCart(req, res, next) {
        new response_success_1.OK({ metadata: await cart_service_1.default.selectAllCart(req) }).send(res);
    }
    static async selectOneCart(req, res, next) {
        new response_success_1.OK({ metadata: await cart_service_1.default.selectOneCart(req) }).send(res);
    }
    static async calculatorPrice(req, res, next) {
        new response_success_1.OK({ metadata: await cart_service_1.default.calculatorPrice(req) }).send(res);
    }
    static async deleteCart(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await cart_service_1.default.deleteCart(req) }).send(res);
    }
    static async updateAddressCart(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await cart_service_1.default.updateAddressCart(req) }).send(res);
    }
}
exports.default = CartController;
