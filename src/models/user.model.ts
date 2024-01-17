import { Schema, model, Document } from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'

export interface UserDocument extends Document {
      email: string
      password: string
      fullName: string
      nickName: string
      verify_email?: boolean
      bob?: Date
      avartar_url_default: string
      avatar_used: string[]
      sercel_url?: string
      gender: string
}

export const userSchema = new Schema<UserDocument>(
      {
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
            bob: { type: Date, default: null },
            gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
            sercel_url: {
                  type: String,
                  default: 'https://res.cloudinary.com/demonodejs/image/upload/v1705389477/static/o5gxkgehijtg9auirdje.jpg'
            },
            avartar_url_default: {
                  type: String,
                  default: 'https://res.cloudinary.com/demonodejs/image/upload/v1705389477/static/o5gxkgehijtg9auirdje.jpg'
            },
            avatar_used: {
                  type: [String],
                  default: []
            }
      },
      { timestamps: true, collection: COLLECTION_NAME }
)

const userModel = model<UserDocument>(DOCUMENT_NAME, userSchema)

export default userModel
