"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    static async register(req, res, next) {
        // return res.json(await AuthService.register(req, res))
        new response_success_1.CREATE({ metadata: await auth_service_1.default.register(req, res) }).send(res);
    }
    static async logout(req, res, next) {
        new response_success_1.OK({ metadata: await auth_service_1.default.logout(req, res) }).send(res);
    }
    static async login(req, res, next) {
        // const { user, keyStore, refresh_token = null } = req
        new response_success_1.OK({ metadata: await auth_service_1.default.login(req, res) }).send(res);
    }
    static async refresh_token(req, res) {
        new response_success_1.OK({ metadata: await auth_service_1.default.refresh_token(req, res) }).send(res);
    }
    static async loginWithGoogle(req, res, next) {
        new response_success_1.OK({ metadata: await auth_service_1.default.loginWithGoogle(req) }).send(res);
    }
}
exports.default = AuthController;
