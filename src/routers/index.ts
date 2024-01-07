import { Router } from 'express'
import authRouter from './auth'

const router = Router()

//auth
router.use('/v1/api/auth', authRouter)
router.get('/getData', (req, res, next) => {
      res.json({ data: ['1', '2', '3', '4'] })
})
export default router
