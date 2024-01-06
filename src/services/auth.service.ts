import { Request, Response } from 'express'
import UserService from './user.service'
import SelectData from '~/utils/SelectData'
import Convert from '~/utils/convert'
import { randomBytes } from 'crypto'
import ProviderJWT, { IToken } from '~/utils/provider.jwt'
import keyStoreModel, { IKeyStoreDoc } from '~/models/keyStore.model'
import KeyStoreService from './keyStore.service'
import { AuthFailedError, BadRequestError, NotFoundError, ResponseError } from '~/Core/response.error'
import bcrypt from 'bcrypt'
import { IRequestCustom } from '~/middlewares/authentication'
import { UserDocument } from '~/models/user.model'
import ProviderBcrypt from '~/utils/bcrypt.util'
class AuthService {
      //REGISTER
      static async register(req: Request, res: Response) {
            // req.body --> email, password
            const { email, password } = req.body
            console.log(password)
            //check email trong database
            const foundEmail = await UserService.findUserByEmail({ email })
            console.log(foundEmail)
            if (foundEmail) throw new BadRequestError({ detail: 'Email đã được đăng kí' })

            //hash pass
            const salt = await bcrypt.genSalt(10)

            const hashPassword = await bcrypt.hash(String(password).trim(), salt)
            if (!hashPassword) throw new ResponseError({ detail: 'Hash failed' })

            // tạo account user
            const createUser = await UserService.createUser({ email, password: hashPassword })
            const { email: emailUser, _id } = createUser
            // {public_key, private_key}
            const public_key = randomBytes(64).toString('hex')
            const private_key = randomBytes(64).toString('hex')

            const { access_token, refresh_token } = (await ProviderJWT.createPairToken({
                  payload: { email: emailUser, _id },
                  key: { public_key, private_key }
            })) as IToken

            await KeyStoreService.createKeyStoreUser({
                  user_id: _id,
                  public_key,
                  private_key,
                  refresh_token,
                  access_token
            })

            // res.cookie('refresh_token', refresh_token)
            //return cho class Response ở controller
            return {
                  user: SelectData.omit(Convert.convertPlantObject(createUser as object), ['password', 'createdAt', 'updatedAt', '__v']),
                  access_token,
                  refresh_token
            }
      }

      //LOGIN

      static async login({ user, keyStore, refresh_token }: IRequestCustom, req: IRequestCustom, res: Response) {
            const { email, password } = req.body
            console.log('check login', { user, keyStore, refresh_token })
            // found email
            const foundEmail = await UserService.findUserByEmail({ email })
            if (!foundEmail) throw new NotFoundError({ detail: 'Not found Email' })
            // match email with user._id
            if (!foundEmail._id.equals(user?._id)) throw new BadRequestError({ detail: 'client_id not match email' })

            // compare pass
            const comparePass = await ProviderBcrypt.comparePass({ password, hashPassword: (user as UserDocument).password })
            // console.log('compare', comparePass, password, foundEmail.password)
            const { access_token, refresh_token: new_rf } = ProviderJWT.createPairToken({
                  payload: { _id: foundEmail._id, email: foundEmail.email },
                  key: { private_key: keyStore?.private_key as string, public_key: keyStore?.public_key as string }
            }) as IToken
            if (refresh_token) {
                  await keyStoreModel?.updateOne({
                        user_id: foundEmail._id,
                        $set: { refresh_token: new_rf },
                        $addToSet: { refresh_token_used: refresh_token }
                  })
                  res.cookie('refresh_token', new_rf)
            }

            if (!refresh_token) {
                  await keyStoreModel.updateOne({ user_id: foundEmail._id, refresh_token: new_rf, access_token })
                  res.cookie('refresh_token', new_rf)
            }

            return {
                  user: SelectData.omit(Convert.convertPlantObject(foundEmail as object), ['password', 'createdAt', 'updatedAt', '__v']),
                  token: access_token,
                  rf: new_rf
            }
            // check mail
            //compare pass
            // create pair -> at , rt
            //check rf

            //if has -> rf = old and rf_used.push(rf), -> rf: rf_new
      }
}

export default AuthService
