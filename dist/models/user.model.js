"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.avatarUsedSchema = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';
exports.avatarUsedSchema = new mongoose_1.Schema({
    public_id: { type: String },
    secure_url: { type: String }
});
// const userAddressSchema = new Schema<UserAddressDoc>({
//       address_street: { type: String, required: true },
//       address_ward: { type: String, required: true },
//       address_district: { type: String, required: true },
//       address_province: { type: String, required: true },
//       address_type: { type: String, enum: ['Home', 'Company', 'Private'], default: 'Private' },
//       address_default: { type: Boolean, default: false },
//       address_creation_time: { type: Date, default: Date.now() }
// })
exports.userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        maxlength: 60,
        require: true
    },
    fullName: { type: String },
    nickName: { type: String },
    verify_email: { type: Boolean, default: false },
    bob: { type: Date, default: Date.now() },
    roles: { type: [String], enum: ['user', 'shop', 'admin'], default: ['user'] },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    avatar: {
        secure_url: String,
        public_id: String,
        date_update: Date
    },
    avatar_url_default: {
        type: String,
        default: 'https://res.cloudinary.com/demonodejs/image/upload/v1705389477/static/o5gxkgehijtg9auirdje.jpg'
    },
    avatar_used: {
        type: [
            {
                secure_url: String,
                public_id: String,
                date_update: Date
            }
        ],
        default: []
    },
    isOpenShop: { type: Boolean, default: false },
    isCartSelectAll: { type: Boolean, default: false },
    user_address: {
        type: [
            {
                address_text: { type: String, required: true },
                address_street: { type: String, required: true },
                address_ward: {
                    type: {
                        code: String,
                        text: String
                    },
                    required: true
                },
                address_district: {
                    type: {
                        code: String,
                        text: String
                    },
                    required: true
                },
                address_province: {
                    type: {
                        code: String,
                        text: String
                    },
                    required: true
                },
                address_type: { type: String, enum: ['Home', 'Company', 'Private'], default: 'Private' },
                address_default: { type: Boolean, default: false },
                address_creation_time: { type: Date, default: Date.now() }
            }
        ]
    },
    product_see: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', require: true }],
    user_address_count: { type: Number, default: 0 }
}, { timestamps: true, collection: COLLECTION_NAME });
const userModel = (0, mongoose_1.model)(DOCUMENT_NAME, exports.userSchema);
exports.default = userModel;
