import { NextFunction, Request, Response, Router } from 'express'
import AuthController from '~/controllers/authController'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const authRouter = Router()

authRouter.get('', (req: Request, res: Response, next: NextFunction) => {
      return res.json('auth')
})

authRouter.post('/register', asyncHandler(AuthController.register))
authRouter.use(authentication)
authRouter.post('/login', asyncHandler(AuthController.login))
authRouter.post('/logout', AuthController.logout)
authRouter.post('refresh_token', () => console.log('OK'))

export default authRouter
