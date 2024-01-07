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
import { isObjectIdOrHexString } from 'mongoose'
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

            const hashPassword = await bcrypt.hash(password, 10)
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

            res.cookie('refresh_token', refresh_token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true })
            //return cho class Response ở controller
            return {
                  user: SelectData.omit(Convert.convertPlantObject(createUser as object), ['password', 'createdAt', 'updatedAt', '__v']),
                  access_token,
                  refresh_token
            }
      }

      //LOGIN

      static async login(req: IRequestCustom, res: Response) {
            const { email, password } = req.body
            // found email
            const foundEmail = await UserService.findUserByEmail({ email })
            if (!foundEmail) throw new NotFoundError({ detail: 'Not found Email' })
            // match email with user._id

            // compare pass

            const comparePass = await bcrypt.compareSync(password, foundEmail.password)
            if (!comparePass) throw new AuthFailedError({ detail: 'Pw wrg' })

            const keyStore = await KeyStoreService.findKeyByUserId({ user_id: foundEmail._id })
            if (!keyStore) throw new NotFoundError({ detail: 'Not found key' })

            const { access_token, refresh_token: new_rf } = ProviderJWT.createPairToken({
                  payload: { _id: foundEmail._id, email: foundEmail.email },
                  key: { private_key: keyStore?.private_key as string, public_key: keyStore?.public_key as string }
            }) as IToken

            //check token cu
            if (req?.cookies['refresh_token']) {
                  const refresh_token = req.cookies['refresh_token'] as string

                  // neu hop le thi thu hoi
                  if (refresh_token === keyStore.refresh_token) {
                        if (keyStore.refresh_token_used.includes(refresh_token)) {
                              throw new AuthFailedError({ detail: 'Token da duoc su dung' })
                        }
                        await keyStoreModel?.findOneAndUpdate(
                              { user_id: foundEmail._id },
                              { $set: { refresh_token: new_rf }, $addToSet: { refresh_token_used: refresh_token } }
                        )
                  }

                  res.cookie('refresh_token', new_rf)
                  return {
                        user: SelectData.omit(Convert.convertPlantObject(foundEmail as object), [
                              'password',
                              'createdAt',
                              'updatedAt',
                              '__v'
                        ]),
                        access_token // rf: new_rf
                  }
                  // else {
                  //                         const foundKeyRf = await KeyStoreService.findKeyByRf({ refresh_token })
                  //                         if (foundKeyRf) await KeyStoreService.deleteKeyStore({ user_id: foundKeyRf.user_id.toString() })
                  //                         throw new AuthFailedError({})
                  //                   }
            }

            return {
                  user: SelectData.omit(Convert.convertPlantObject(foundEmail as object), ['password', 'createdAt', 'updatedAt', '__v']),
                  access_token
            }
      }

      static async refresh_token(req: IRequestCustom, res: Response) {
            const { refresh_token, keyStore, user } = req

            console.log('check ref', refresh_token, keyStore?.refresh_token)
            if (refresh_token === keyStore?.refresh_token && !keyStore?.refresh_token_used.includes(refresh_token as string)) {
                  const { access_token, refresh_token: newRf } = (await ProviderJWT.createPairToken({
                        payload: { email: user?.email as string, _id: user?._id },
                        key: { public_key: (keyStore as IKeyStoreDoc).public_key, private_key: (keyStore as IKeyStoreDoc).private_key }
                  })) as IToken
                  await keyStoreModel.findOneAndUpdate(
                        { user: user?._id },
                        { $addToSet: { refresh_token_used: refresh_token }, $set: { refresh_token: newRf, access_token } }
                  )
                  return { token: access_token }
            }
            throw new AuthFailedError({ detail: 'Rf token not vaild' })
      }
}

export default AuthService
