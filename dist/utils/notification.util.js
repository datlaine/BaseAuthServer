"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderNotificationShop = exports.renderNotificationProduct = exports.renderNotificationUser = exports.renderNotificationSystem = void 0;
const mongoose_1 = require("mongoose");
const renderNotificationSystem = (message) => {
    const notification_attribute = {
        notification_type: 'SYSTEM',
        notification_content: message
    };
    return { notification_attribute };
};
exports.renderNotificationSystem = renderNotificationSystem;
const renderNotificationUser = (message) => {
    const notification_attribute = {
        notification_type: 'USER',
        notification_content: message
    };
    return { notification_attribute };
};
exports.renderNotificationUser = renderNotificationUser;
const renderNotificationProduct = ({ message, order_id, product_name, product_quantity }) => {
    const notificationProduct = {
        notification_attribute: {
            notification_type: 'PRODUCT',
            product_name,
            product_quantity,
            notification_content: message,
            order_id: new mongoose_1.Types.ObjectId(order_id)
        }
    };
    return notificationProduct;
};
exports.renderNotificationProduct = renderNotificationProduct;
const renderNotificationShop = ({ message, order_id, order_product_id, user_buy_id, product_name, product_quantity, product_image }) => {
    const notificationProduct = {
        notification_attribute: {
            notification_type: 'SHOP',
            notification_content: message,
            order_id: new mongoose_1.Types.ObjectId(order_id),
            order_product_id: new mongoose_1.Types.ObjectId(order_product_id),
            user_buy_id: new mongoose_1.Types.ObjectId(user_buy_id),
            product_name,
            product_quantity,
            product_image
        }
    };
    return notificationProduct;
};
exports.renderNotificationShop = renderNotificationShop;
