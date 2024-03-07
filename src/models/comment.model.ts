import { Document, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'

export type TComment = {
      comment_user_id: Types.ObjectId
      comment_product_id: Types.ObjectId
      comment_date: Date
      comment_content: string
      comment_vote: number
      comment_image?: {
            secure_url: string
            public_id: string
            create_time_upload: string
      }[]
}

export type TCommentDoc = TComment & Document

export const commentSchema = new Schema<TCommentDoc>(
      {
            comment_user_id: { type: Schema.Types.ObjectId, ref: 'User', require: true },
            comment_product_id: { type: Schema.Types.ObjectId, ref: 'Product', require: true },

            comment_date: { type: Date, default: Date.now, required: true },
            comment_content: { type: String, maxlength: 100, required: true },
            comment_vote: { type: Number, required: true, min: 1, max: 5 },
            comment_image: {
                  type: [
                        new Schema({
                              secure_url: { type: String, require: true, default: '' },
                              public_id: { type: String, require: true, default: '' },
                              create_time_upload: { type: Date, require: true, default: Date.now }
                        })
                  ],
                  default: []
            }
      },
      {
            timestamps: true,
            collection: COLLECTION_NAME
      }
)

export const commentModel = model<TCommentDoc>(DOCUMENT_NAME, commentSchema)
