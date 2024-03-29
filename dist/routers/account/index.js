"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloundinary_config_1 = require("../../configs/cloundinary.config");
const account_controller_1 = __importDefault(require("../../controllers/account.controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
//update-image -> ok
//update-image/:user_id => ok
//req.params la 1 object
const accountRouter = (0, express_1.Router)();
accountRouter.use(authentication_1.default);
accountRouter.post('/getme', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.getMe));
accountRouter.get('/getme', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.getMeQuery));
accountRouter.post('/update-info', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updateInfo));
accountRouter.post('/update-password', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updatePassword));
accountRouter.post('/update-avatar', cloundinary_config_1.upload.single('file'), (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updateAvatar));
accountRouter.get('/getAllAvatar', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.getAllAvatar));
accountRouter.post('/deleteAvatarUsed', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.deleteAvatarUsed));
accountRouter.post('/deleteAvatar', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.deleteAvatar));
accountRouter.post('/add-address', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.addAddress));
accountRouter.post('/set-address-default', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.setAddressDefault));
accountRouter.delete('/delete-address/:address_id', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.deleteAddress));
accountRouter.post('/check-password', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.securityPassword));
accountRouter.post('/update-email', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updateEmail));
accountRouter.post('/update-password', (0, asyncHandler_1.asyncHandler)(account_controller_1.default.updatePassword));
exports.default = accountRouter;
