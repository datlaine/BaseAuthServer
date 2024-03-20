"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const notification_service_1 = __importDefault(require("../services/notification.service"));
class NotificationController {
    static async getMeNotification(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await notification_service_1.default.getMeNotification(req) }).send(res);
    }
    static async getMyShopNotifications(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await notification_service_1.default.getMyShopNotifications(req) }).send(res);
    }
    static async getMeNotificationPage(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await notification_service_1.default.getMeNotificationPage(req) }).send(res);
    }
    static async readNotification(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await notification_service_1.default.readNotification(req) }).send(res);
    }
    static async deleteNotification(req, res, next) {
        new response_success_1.ResponseSuccess({ metadata: await notification_service_1.default.deleteNotification(req) }).send(res);
    }
}
exports.default = NotificationController;
