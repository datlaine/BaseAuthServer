import { Request, Router } from 'express'
import AccountController from '~/controllers/account.controller'
import AuthController from '~/controllers/authController'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'
import AccountService from '~/services/account.service'

//update-image -> ok
//update-image/:user_id => ok
//req.params la 1 object
const accountRouter = Router()
accountRouter.use(authentication)
accountRouter.get('/getme', asyncHandler(AccountController.getMe))
accountRouter.get('/update-avatar/:user_id')
accountRouter.post('/update-info', asyncHandler(AccountController.updateInfo))

export default accountRouter
