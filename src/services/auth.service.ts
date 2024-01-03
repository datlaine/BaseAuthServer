import { NextFunction, Request, Response } from 'express'
import UserService from './user.service'
import SelecetData from '~/utils/SelectData'
import SelectData from '~/utils/SelectData'
import { convertPlantObject } from '~/utils/convert'
import { randomBytes } from 'crypto'
import ProviderJWT, { IToken } from '~/utils/provider_jwt'

class AuthService {
      //REGISTER
      static async register(req: Request, res: Response) {
            // req.body --> email, password
            const { email, password } = req.body

            //check email trong database
            const foundEmail = await UserService.findUserByEmail({ email })
            if (foundEmail) return res.json('Email đã được đăng kí')

            // tạo account user
            const createUser = await UserService.createUser({ email, password })
            const { email: emailUser, _id } = createUser
            // {public_key, private_key}
            const public_key = randomBytes(64).toString('hex')
            const private_key = randomBytes(64).toString('hex')

            const { access_token, refresh_token } = await ProviderJWT.createPairToken<IToken>({
                  payload: { email: emailUser, _id },
                  key: { public_key, private_key }
            })

            //return cho class Response ở controller
            return SelectData.omit(convertPlantObject(createUser as object), [
                  'password',
                  'createdAt',
                  'updatedAt',
                  '__v'
            ])
      }
}

export default AuthService
