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
import bodyParser from 'body-parser'
import productModel from './models/product.model'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'node_modules/socket.io/dist/typed-events'
import { renderNotificationSystem } from './utils/notification.util'

config()
declare global {
      var _io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
}

//////START//////
//khởi tạo express
const app = express()
const server = createServer(app)
const io = new Server(server)
global._io = io // cach 2

//midlewares
app.use(helmet())
app.use(compression())
app.use(
      cors({
            credentials: true,
            origin: [process.env.MODE === 'DEV' ? 'http://localhost:3000' : (process.env.CLIENT_URL as string)],
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
console.log(renderNotificationSystem('Xin chào'))
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

const PORT = process.env.MODE === 'DEV' ? 4000 : process.env.PORT

server.listen(PORT!, () => {
      console.log('Server is runing')
})

export default app
