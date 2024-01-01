import { Router } from 'express'
import authRouter from './auth'

const router = Router()

//auth
router.use('/v1/api/auth', authRouter)

export default router
