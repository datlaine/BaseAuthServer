import { NextFunction, Request, Response, Router } from 'express'
import AuthController from '~/controllers/authController'

const authRouter = Router()

authRouter.get('', (req: Request, res: Response, next: NextFunction) => {
      return res.json('auth')
})

authRouter.get('/login', AuthController.login)

authRouter.post('/logout', AuthController.logout)

authRouter.post('/register', AuthController.register)

export default authRouter
