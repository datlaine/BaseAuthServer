import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'

const userSchema = new Schema(
      {
            username: {
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

const userModel = model(DOCUMENT_NAME, userSchema)

export default userModel
