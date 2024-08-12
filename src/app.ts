import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
//middlwares
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
// .env
import { config } from 'dotenv'
// mongosose
import bodyParser from 'body-parser'
import { createServer } from 'http'
import { DefaultEventsMap } from 'node_modules/socket.io/dist/typed-events'
import { Server } from 'socket.io'
import { reasonCode, statusCode } from './Core/httpStatusCode'
import MongoConnect from './Database/mongo.connect'
import router from './routers'
import { renderNotificationSystem } from './utils/notification.util'

config()

//////START//////
//khởi tạo express
const app = express()

//midlewares
app.use(helmet())
app.use(compression())
app.use(
      cors({
            credentials: true,
            origin: [
                  process.env.MODE === 'DEV' ? 'http://localhost:3001' : (process.env.CLIENT_URL as string),
                  'http://localhost:3001',
                  process.env.CLIENT_URL as string
            ],
            exposedHeaders: ['set-cookie']

            // origin: 'http://localhost:3000'
            // origin: '*'
      })
)

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//Connect -> Database -> Mongo
MongoConnect.Connect()

app.use('', router)
// app.use((req, res, next) => console.log(new Error().stack))

interface IError {
      code?: number
      message?: string
      stack?: string
      detail?: string
      error: any
}

app.use(((error: IError, req: Request, res: Response, next: NextFunction) => {
      console.log('errroHandle', JSON.parse(JSON.stringify(error.stack || 'Not')))
      const code = error.code ? error.code : statusCode.INTERNAL_SERVER_ERROR
      const message = error.message ? error.message : reasonCode.INTERNAL_SERVER_ERROR
      const detail = error.detail ? error.detail : null
      return res.status(code).send({ code, message, detail })
}) as ErrorRequestHandler)

const PORT = process.env.MODE === 'DEV' ? 4001 : process.env.PORT

app.listen(PORT!, () => {
      console.log('Server is runing')
})

export default app
