import express, { NextFunction, Request, RequestHandler, Response, request } from 'express'
//middlwares
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// .env
import { config } from 'dotenv'
// mongosose
import router from './routers'
import MongoConnect from './Database/mongo.connect'

config()

//////START//////
//khởi tạo express
const app = express()

//midlewares
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

//Connect -> Database -> Mongo
MongoConnect.Connect()

app.use('', router)
// app.use((req, res, next) => console.log(new Error().stack))

app.listen(8080, () => {
      console.log('Server is runing')
})

export default app
