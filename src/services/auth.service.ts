import { Request, Response } from 'express'
import UserService from './user.service'
import SelectData from '~/utils/SelectData'
import Convert from '~/utils/convert'
import { randomBytes } from 'crypto'
import ProviderJWT, { IToken } from '~/utils/provider.jwt'
import keyStoreModel, { IKeyStoreDoc } from '~/models/keyStore.model'
import KeyStoreService from './keyStore.service'
import { AuthFailedError, BadRequestError, ForbiddenError, NotFoundError, ResponseError } from '~/Core/response.error'
import bcrypt from 'bcrypt'
import { IRequestCustom } from '~/middlewares/authentication'
import { UserDocument } from '~/models/user.model'
import { getGoogleUser, getOautGoogleToken } from '~/utils/google.oauth'
class AuthService {
      //REGISTER
      static async register(req: Request, res: Response) {
            // req.body --> email, password
            const { email, password } = req.body
            //check email trong database
            const foundEmail = await UserService.findUserByEmail({ email })
            console.log('email', foundEmail)
            if (foundEmail) throw new BadRequestError({ detail: 'Email đã được đăng kí' })

            //hash pass

            const hashPassword = await bcrypt.hash(password, 10)
            if (!hashPassword) throw new ResponseError({ detail: 'Hash failed' })

            // tạo account user
            const createUser = await UserService.createUser({ email, password: hashPassword })
            const { email: emailUser, _id, roles } = createUser
            // {public_key, private_key}
            const public_key = randomBytes(64).toString('hex')
            const private_key = randomBytes(64).toString('hex')

            const { access_token, refresh_token } = (await ProviderJWT.createPairToken({
                  payload: { email: emailUser, _id, roles },
                  key: { public_key, private_key }
            })) as IToken

            await KeyStoreService.createKeyStoreUser({
                  user_id: _id,
                  public_key,
                  private_key,
                  refresh_token,
                  access_token
            })

            res.cookie('refresh_token', refresh_token, { maxAge: 1000 * 60 * 60 * 24 * 7 })
            //return cho class Response ở controller
            return {
                  user: SelectData.omit(Convert.convertPlantObject(createUser as object), ['password', 'createdAt', 'updatedAt', '__v']),
                  access_token
            }
      }

      //LOGIN

      static async login(req: IRequestCustom, res: Response) {
            const { email, password } = req.body
            // found email
            const foundUser = await UserService.findUserByEmail({ email })
            if (!foundUser) throw new AuthFailedError({ detail: 'Đăng nhập thất bại, vui lòng nhập thông tin hợp lệ' })
            // match email with user._id

            // compare pass

            const comparePass = await bcrypt.compareSync(password, foundUser.password)
            if (!comparePass) throw new AuthFailedError({ detail: 'Đăng nhập thất bại, vui lòng nhập thông tin hợp lệ' })

            const public_key = randomBytes(64).toString('hex')
            const private_key = randomBytes(64).toString('hex')
            const keyStore = await keyStoreModel.findOneAndUpdate(
                  { user_id: foundUser._id },
                  { $set: { public_key, private_key } },
                  { new: true, upsert: true }
            )
            // const keyStore = await KeyStoreService.findKeyByUserId({ user_id: foundUser._id })
            // if (!keyStore) throw new NotFoundError({ detail: 'Not found key' })

            const { access_token, refresh_token: new_rf } = ProviderJWT.createPairToken({
                  payload: { _id: foundUser._id, email: foundUser.email, roles: foundUser.roles },
                  key: { private_key: keyStore?.private_key as string, public_key: keyStore?.public_key as string }
            }) as IToken

            //check token cu
            if (req?.cookies['refresh_token']) {
                  const refresh_token = req.cookies['refresh_token'] as string

                  // neu hop le thi thu hoi
                  if (refresh_token === keyStore.refresh_token) {
                        // if (keyStore.refresh_token_used.includes(refresh_token)) {
                        // throw new AuthFailedError({ detail: 'Token da duoc su dung' })
                        // res.clearCookie('refresh-token')
                        await keyStoreModel?.findOneAndUpdate(
                              { user_id: foundUser._id },
                              { $set: { refresh_token: new_rf }, $addToSet: { refresh_token_used: refresh_token } }
                        )
                        // }
                  }
            }
            res.cookie('refresh_token', new_rf, { maxAge: 1000 * 60 * 60 * 24 * 7 })
            await keyStoreModel?.findOneAndUpdate({ user_id: foundUser._id }, { $set: { refresh_token: new_rf } })
            return {
                  user: SelectData.omit(Convert.convertPlantObject(foundUser as object), ['password', 'createdAt', 'updatedAt', '__v']),
                  access_token
            }
      }

      // logout

      static async logout(req: IRequestCustom, res: Response) {
            const { keyStore, user } = req
            await KeyStoreService.deleteKeyStore({ user_id: (user as UserDocument).id })
            res.clearCookie('refresh_token')

            return { message: 'Logout success!!' }
      }

      static async refresh_token(req: IRequestCustom, res: Response) {
            const { refresh_token, keyStore, user } = req

            // console.log({ old: keyStore?.refresh_token, token: refresh_token, used: keyStore?.refresh_token_used })

            if (keyStore?.refresh_token_used.includes(refresh_token as string)) {
                  await keyStoreModel.deleteOne({ user_id: user?._id })
                  throw new ForbiddenError({ detail: 'Token đã được sử dụng444' })
            }

            if (keyStore?.refresh_token !== refresh_token) throw new ForbiddenError({ detail: 'Token không đúng' })

            const { access_token, refresh_token: newRf } = (await ProviderJWT.createPairToken({
                  payload: { email: user?.email as string, _id: user?._id, roles: user?.roles as string[] },
                  key: { public_key: keyStore?.public_key as string, private_key: keyStore?.private_key as string }
            })) as IToken
            const update = await keyStoreModel
                  .updateOne(
                        { user_id: user?._id },
                        {
                              $set: { refresh_token: newRf },
                              $addToSet: { refresh_token_used: refresh_token }
                        },
                        { upsert: true, new: true }
                  )
                  .lean()
            // console.log({ update })
            res.cookie('refresh_token', newRf, { maxAge: 1000 * 60 * 60 * 24 * 7 })
            return { token: access_token, rf: newRf, user }
      }

      static async loginWithGoogle(req: Request<unknown, unknown, unknown, { code: any }>) {
            // console.log('query', req.query.code)
            // return req.query.code
            const { code } = req.query
            const token = await getOautGoogleToken(code)
            // eslint-disable-next-line prettier/prettier
            const { id_token, access_token } = token
            const googleUser: any = await getGoogleUser({ id_token, access_token })
            // console.log(googleUser)
            const user = googleUser.data
            if ('verified_email' in googleUser) {
                  if (!googleUser.verified_email) {
                        new ForbiddenError({ detail: 'block' })
                  }
            }

            return { image: user.picture, name: user.name }
      }
}

export default AuthService
