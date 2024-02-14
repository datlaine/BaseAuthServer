import { Schema, model, Document } from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'

interface IAvaterUsed extends Document {
      public_id: string
      secure_url: string
}

export interface UserDocument extends Document {
      email: string
      password: string
      fullName: string
      nickName: string
      verify_email?: boolean
      bob?: Date
      roles: string[]
      avartar_url_default: string
      avatar: {
            secure_url?: string
            public_id: string
            date_update: Date
      }
      avatar_used: {
            secure_url: string
            public_id: string
            date_update: Date
      }[]
      user_address: [string]
      gender: string
      isOpenShop?: boolean
}

export const avatarUsedSchema = new Schema<IAvaterUsed>({
      public_id: { type: String },
      secure_url: { type: String }
})

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
            bob: { type: Date, default: Date.now() },
            roles: { type: [String], enum: ['user', 'shop', 'admin'], default: ['user'] },
            gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
            avatar: {
                  secure_url: String,
                  public_id: String,
                  date_update: Date
            },
            avartar_url_default: {
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

            user_address: { types: [String], default: [] }
      },
      { timestamps: true, collection: COLLECTION_NAME }
)

const userModel = model<UserDocument>(DOCUMENT_NAME, userSchema)

export default userModel
