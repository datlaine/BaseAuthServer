"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.HEADER = void 0;
const keyStore_service_1 = __importDefault(require("../services/keyStore.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../helpers/asyncHandler");
const response_error_1 = require("../Core/response.error");
exports.HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
};
// type IParamsAuthentication = {}
exports.authentication = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const client_id = req.cookies['client_id'];
    const access_token = req.cookies['access_token'];
    const refresh_token = req.cookies['refresh_token'];
    if (!client_id || !access_token) {
        throw new response_error_1.ForbiddenError({ detail: 'Phiên đăng nhập hết hạn client' });
    }
    // tim user
    const user = await user_service_1.default.findUserById({ _id: client_id });
    if (!user)
        throw new response_error_1.ForbiddenError({ detail: 'Không tìm thấy tài khoản' });
    // tim key
    const keyStore = await keyStore_service_1.default.findKeyByUserId({ user_id: user._id });
    if (!keyStore)
        throw new response_error_1.ForbiddenError({ detail: 'Phiên đăng nhập hết hạn key' });
    // case: refresh_token
    if (req.originalUrl === '/v1/api/auth/rf') {
        // console.log({ refresf: req?.cookies['refresh_token'], keyStore })
        if (!req?.cookies['refresh_token']) {
            return next(new response_error_1.ForbiddenError({ detail: 'Token không đúng' }));
        }
        if (req?.cookies['refresh_token']) {
            jsonwebtoken_1.default.verify(refresh_token, keyStore.private_key, (error, decode) => {
                if (error) {
                    // req.user = user
                    if (req.originalUrl === '/v1/api/auth/logout') {
                        req.user = user;
                        return next();
                    }
                    return next(new response_error_1.ForbiddenError({ detail: 'Token không đúng' }));
                }
                // console.log('decode::', decode)
                const decodeType = decode;
                // if (decodeType._id !== client_id) throw new AuthFailedError({})
                req.user = user;
                req.keyStore = keyStore;
                req.refresh_token = refresh_token;
            });
            return next();
        }
    }
    // case authentication thông thường
    if (access_token) {
        jsonwebtoken_1.default.verify(access_token, keyStore.public_key, (error, decode) => {
            if (error) {
                console.log({ error });
                return next(new response_error_1.AuthFailedError({ detail: 'Token hết hạn' }));
            }
            const decodeType = decode;
            if (decodeType._id !== client_id)
                throw new response_error_1.AuthFailedError({ detail: 'client-id not match user' });
            req.user = user;
            req.keyStore = keyStore;
        });
        return next();
    }
    console.log('...');
    return next();
});
exports.default = exports.authentication;
