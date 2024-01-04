import { Schema, model, Document } from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'

export interface UserDocument extends Document {
      email: string
      password: string
}

export const userSchema = new Schema<UserDocument>(
      {
            email: {
                  type: String,
                  require: true
            },
            password: {
                  type: String,
                  require: true
            }
      },
      { timestamps: true, collection: COLLECTION_NAME }
)

const userModel = model<UserDocument>(DOCUMENT_NAME, userSchema)

export default userModel
