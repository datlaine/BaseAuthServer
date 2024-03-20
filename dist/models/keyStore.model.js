"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyStoreSchema = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'KeyStore';
const COLLECTION_NAME = 'keystores';
exports.keyStoreSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    public_key: {
        type: String,
        require: true
    },
    access_token: { type: String, require: true },
    private_key: { type: String, require: true },
    refresh_token: { type: String, require: true },
    refresh_token_used: { type: [String], default: [] }
}, { timestamps: true, collection: COLLECTION_NAME });
const keyStoreModel = (0, mongoose_1.model)(DOCUMENT_NAME, exports.keyStoreSchema);
exports.default = keyStoreModel;
