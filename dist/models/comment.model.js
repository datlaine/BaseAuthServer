"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentModel = exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'comments';
exports.commentSchema = new mongoose_1.Schema({
    comment_user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', require: true },
    comment_product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', require: true },
    comment_date: { type: Date, default: Date.now, required: true },
    comment_content: { type: String, maxlength: 100, required: true },
    comment_vote: { type: Number, required: true, min: 1, max: 5 },
    comment_image: {
        type: [
            new mongoose_1.Schema({
                secure_url: { type: String, require: true, default: '' },
                public_id: { type: String, require: true, default: '' },
                create_time_upload: { type: Date, require: true, default: Date.now }
            })
        ],
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
exports.commentModel = (0, mongoose_1.model)(DOCUMENT_NAME, exports.commentSchema);
