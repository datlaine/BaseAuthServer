import { Router, Request, Response, NextFunction } from 'express'
import authRouter from './auth'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import AuthController from '~/controllers/authController'
import accountRouter from './account'
import productRouter from './product'
config()
const router = Router()

//auth
router.use('/v1/api/auth', authRouter)
router.get('/getData', (req, res, next) => {
      res.json({ data: ['1', '2', '3', '4'] })
})
router.use('/v1/api/account', accountRouter)
router.use('/v1/api/product', productRouter)
router.get('/v1/api/test', (req: Request<unknown, unknown, unknown, { page: string; name: string }>, res: Response, next: NextFunction) => {
      const query = req.query.page
      const name = req.query.name
      return res.json({ query, name })
})

router.get('/api/oauth/google', AuthController.loginWithGoogle)

export default router
