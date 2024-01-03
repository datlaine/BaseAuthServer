import { Document, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'KeyStore'
const COLLECTION_NAME = 'Keystores'

export interface IKeyStore extends Document {
      user_id: Types.ObjectId
      public_key: string
      private_key: string
      refresh_token: string
      refresh_token_used: Types.Array<string>
}

const keyStoreSchema = new Schema<IKeyStore>(
      {
            user_id: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  require: true
            },
            public_key: {
                  type: String,
                  require: true
            },
            private_key: { type: String, require: true },
            refresh_token: { type: String, require: true },
            refresh_token_used: { type: [String], default: [] }
      },
      { timestamps: true, collection: COLLECTION_NAME }
)

const keyStoreModel = model(DOCUMENT_NAME, keyStoreSchema)

export default keyStoreModel
