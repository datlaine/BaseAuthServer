"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const account_service_1 = __importDefault(require("../services/account.service"));
class AccountController {
    static async getMe(req, res, next) {
        new response_success_1.OK({ metadata: await account_service_1.default.getMe(req) }).send(res);
    }
    static async updateAvatar(req, res, next) {
        new response_success_1.OK({ metadata: await account_service_1.default.updateAvatar(req) }).send(res);
    }
    static async updateInfo(req, res, next) {
        new response_success_1.OK({ metadata: await account_service_1.default.updateInfo(req) }).send(res);
    }
    static async getAllAvatar(req, res, next) {
        new response_success_1.OK({ metadata: await account_service_1.default.getAllAvatar(req) }).send(res);
    }
    static async deleteAvatarUsed(req, res, next) {
        new response_success_1.OK({ metadata: await account_service_1.default.deleteAvatarUsed(req) }).send(res);
    }
    static async deleteAvatar(req, res, next) {
        new response_success_1.OK({ metadata: await account_service_1.default.deleteAvatar(req) }).send(res);
    }
    static async addAddress(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await account_service_1.default.addAddress(req) }).send(res);
    }
    static async setAddressDefault(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await account_service_1.default.setAddressDefault(req) }).send(res);
    }
    static async deleteAddress(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await account_service_1.default.deleteAddress(req) }).send(res);
    }
    static async securityPassword(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await account_service_1.default.securityPassword(req) }).send(res);
    }
    static async updateEmail(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await account_service_1.default.updateEmail(req) }).send(res);
    }
    static async updatePassword(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await account_service_1.default.updatePassword(req) }).send(res);
    }
}
exports.default = AccountController;
