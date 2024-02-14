import { Document, Schema, Types, model } from 'mongoose'
import { TImage } from './product.model'

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'

export type TComment = {
      comment_user_id: Types.ObjectId
      comment_date: Date
      comment_content: string
      comment_vote: number
      comment_image?: TImage[]
}

export type TCommentDoc = TComment & Document

export const commentSchema = new Schema<TCommentDoc>(
      {
            comment_user_id: { type: Schema.Types.ObjectId, ref: 'User', require: true },
            comment_date: { type: Date, default: Date.now, required: true },
            comment_content: { type: String, maxlength: 100, required: true },
            comment_vote: { type: Number, required: true, min: 1, max: 5 },
            comment_image: {
                  type: [
                        {
                              secure_url: String,
                              public_id: String,
                              date_update: Date
                        }
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
