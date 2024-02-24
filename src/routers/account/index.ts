import { Router } from 'express'
import { upload } from '~/configs/cloundinary.config'
import AccountController from '~/controllers/account.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

//update-image -> ok
//update-image/:user_id => ok
//req.params la 1 object

const accountRouter = Router()
accountRouter.use(authentication)
accountRouter.post('/getme', asyncHandler(AccountController.getMe))
accountRouter.post('/update-info', asyncHandler(AccountController.updateInfo))
accountRouter.post('/update-password', asyncHandler(AccountController.updatePassword))

accountRouter.post('/update-avatar', upload.single('file'), asyncHandler(AccountController.updateAvatar))
accountRouter.get('/getAllAvatar', asyncHandler(AccountController.getAllAvatar))
accountRouter.post('/deleteAvatarUsed', asyncHandler(AccountController.deleteAvatarUsed))
accountRouter.post('/deleteAvatar', asyncHandler(AccountController.deleteAvatar))
accountRouter.post('/add-address', asyncHandler(AccountController.addAddress))
accountRouter.post('/set-address-default', asyncHandler(AccountController.setAddressDefault))
accountRouter.delete('/delete-address/:address_id', asyncHandler(AccountController.deleteAddress))

export default accountRouter
