import mongoose, { Mongoose } from 'mongoose'

import { config } from 'dotenv'
config()
class MongoConnect {
      static connect: Promise<Mongoose>

      static async Connect() {
            if (!MongoConnect.connect) {
                  const connectString = process.env.MODE === 'DEV' ? process.env.MONGO_URI_LOCAL : process.env.MONGO_URI_PRO
                  MongoConnect.connect = mongoose.connect(connectString!)

                  MongoConnect.connect
                        .then(() => {
                              console.log('Connect Database is success')
                        })
                        .catch((e) => console.log('Connect dabase is error::', e))

                  return MongoConnect.connect
            }
            return MongoConnect.connect
      }
}

export default MongoConnect
