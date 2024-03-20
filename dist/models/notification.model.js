"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationModel = exports.notificationSchema = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'notifications';
const notificationMessageSchema = new mongoose_1.Schema({
    notification_attribute: { type: mongoose_1.Schema.Types.Mixed, require: true },
    notification_creation_time: { type: Date, default: Date.now, require: true },
    notification_isRead: { type: Boolean, default: false, require: true }
});
exports.notificationSchema = new mongoose_1.Schema({
    notification_user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    notification_count: { type: Number, default: 0, required: true },
    notifications_message: [notificationMessageSchema]
});
exports.notificationModel = (0, mongoose_1.model)(DOCUMENT_NAME, exports.notificationSchema);
