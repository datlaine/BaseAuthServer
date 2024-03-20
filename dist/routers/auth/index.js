"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../../controllers/authController"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const authRouter = (0, express_1.Router)();
authRouter.get('', (req, res, next) => {
    return res.json('auth');
});
authRouter.post('/register', (0, asyncHandler_1.asyncHandler)(authController_1.default.register));
authRouter.post('/login', (0, asyncHandler_1.asyncHandler)(authController_1.default.login));
authRouter.use(authentication_1.default);
// authRouter.post('/getMe', AuthController.getMe)
authRouter.post('/logout', authController_1.default.logout);
authRouter.post('/rf', (0, asyncHandler_1.asyncHandler)(authController_1.default.refresh_token));
exports.default = authRouter;
