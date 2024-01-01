import express, { NextFunction, Request, RequestHandler, Response } from 'express'
//middlwares
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
// .env
import { config } from 'dotenv'
// mongosose
import mongoose from 'mongoose'
import router from './routers'

config()

//////START//////
//khởi tạo express
const app = express()

//midlewares
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(morgan('dev'))

app.use('', router)

app.listen(8080, () => {
      console.log('Server is runing')
})

// database - mongoose - connect

export default app
