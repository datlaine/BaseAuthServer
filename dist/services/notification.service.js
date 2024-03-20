"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notification_model_1 = require("../models/notification.model");
const notification_repository_1 = __importDefault(require("../repositories/notification.repository"));
const order_repo_1 = __importDefault(require("../repositories/order.repo"));
class NotificationService {
    static async getMeNotification(req) {
        const { user } = req;
        const page = Number(req.query.page);
        const { type } = req.query;
        const limit = Number(req.query.limit);
        const result = await notification_repository_1.default.getNotificationPage({
            user_id: new mongoose_1.Types.ObjectId(user?._id),
            limit,
            page,
            type: type
        });
        return { notifications: result };
    }
    static async getMeNotificationPage(req) {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const { user } = req;
        const result = await notification_repository_1.default.getNotificationPage({
            user_id: new mongoose_1.Types.ObjectId(user?._id),
            limit,
            page,
            type: 'PRODUCT'
        });
        console.log({ result });
        return result;
    }
    static async getMyShopNotifications(req) {
        const { user } = req;
        const { product_id } = req.params;
        //@ Tìm Shop
        // const queryShop = {owner: new Types.ObjectId(user?._id)}
        // const foundShopUser = await shopModel.findOne(queryShop)
        // const query = {_id: new Types.ObjectId(user?._id)}
        // const foundUser = await userModel.findOne(query)
        const result = await order_repo_1.default.getOrderWitId({ order_products_products_id: product_id });
        console.log({ result, product_id });
        return { myNotificationShop: { product_sell: result } };
    }
    static async readNotification(req) {
        const { user } = req;
        const notification_id = req.params.notification_id;
        const query = {
            notification_user_id: new mongoose_1.Types.ObjectId(user?._id),
            notifications_message: { $elemMatch: { _id: new mongoose_1.Types.ObjectId(notification_id) } }
        };
        const update = { 'notifications_message.$.notification_isRead': true };
        await notification_model_1.notificationModel.findOneAndUpdate(query, update);
        return { message: `Đánh dấu đã đọc thông báo có id: ${notification_id}` };
    }
    static async deleteNotification(req) {
        const { user } = req;
        const notification_id = req.params.notification_id;
        const query = {
            notification_user_id: new mongoose_1.Types.ObjectId(user?._id)
        };
        const update = {
            // $pull: { notifications.message: { _id: new Types.ObjectId(notification_id) } },
            $pull: { notifications_message: { _id: new mongoose_1.Types.ObjectId(notification_id) } },
            $inc: { notification_count: -1 }
        };
        const option = { new: true, upsert: true };
        const result = await notification_model_1.notificationModel.findOneAndUpdate(query, update, option);
        console.log({ result123: result });
        return { message: `Đã xóa thông báo có id: ${notification_id}` };
    }
}
exports.default = NotificationService;
