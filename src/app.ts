import express, { NextFunction, Request, Response, request, ErrorRequestHandler } from 'express'
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
import { reasonCode, statusCode } from './Core/httpStatusCode'

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

interface IError {
      code?: number
      message?: string
      stack?: string
      detail?: string
}

app.use(((error: IError, req: Request, res: Response, next: NextFunction) => {
      console.log('errroHandle', JSON.parse(JSON.stringify(error.stack)))
      const code = error.code ? error.code : statusCode.INTERNAL_SERVER_ERROR
      const message = error.message ? error.message : reasonCode.INTERNAL_SERVER_ERROR
      const detail = error.detail ? error.detail : null
      return res.json({ code, message, detail })
}) as ErrorRequestHandler)

app.listen(8080, () => {
      console.log('Server is runing')
})

export default app
