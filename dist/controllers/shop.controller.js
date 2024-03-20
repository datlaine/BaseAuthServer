"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const shop_service_1 = __importDefault(require("../services/shop.service"));
class ShopController {
    static async registerShop(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.registerShop(req) }).send(res);
    }
    static async uploadAvatarShop(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.UploadAvatarShop(req) }).send(res);
    }
    static async deleteAvatarShop(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.deleteAvatarShop(req) }).send(res);
    }
    // static async getShopName(req: IRequestCustom, res: Response, next: NextFunction) {
    //       return new OK({ metadata: await ShopService.getShopName(req) }).send(res)
    // }
    static async getMyShop(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.getMyShop(req) }).send(res);
    }
    static async getProductMyShop(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.getProductMyShop(req) }).send(res);
    }
    static async foundShopHasProductType(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.foundShopHasProductType(req) }).send(res);
    }
    static async getShopInfoOfProduct(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.getShopInfoOfProduct(req) }).send(res);
    }
    static async getShopId(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.getShopId(req) }).send(res);
    }
    static async getProductFilter(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.getProductFilter(req) }).send(res);
    }
    static async getOrderMyShop(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.getOrderMyShop(req) }).send(res);
    }
    static async getShopAdmin(req, res, next) {
        return new response_success_1.OK({ metadata: await shop_service_1.default.getShopAdmin(req) }).send(res);
    }
}
exports.default = ShopController;
