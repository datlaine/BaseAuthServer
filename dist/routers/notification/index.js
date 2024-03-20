"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = __importDefault(require("../../controllers/notification.controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const notificationRouter = (0, express_1.Router)();
notificationRouter.use(authentication_1.default);
notificationRouter.get('/get-my-notification', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.getMeNotification));
notificationRouter.get('/get-my-shop-notifications/:product_id', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.getMyShopNotifications));
notificationRouter.get('/get-my-notification-product', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.getMeNotificationPage));
notificationRouter.post('/read-notification/:notification_id', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.readNotification));
notificationRouter.post('/delete-notification/:notification_id', (0, asyncHandler_1.asyncHandler)(notification_controller_1.default.deleteNotification));
exports.default = notificationRouter;
