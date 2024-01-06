import { NextFunction, Request, Response } from 'express'
import KeyStoreService from '~/services/keyStore.service'
import UserService from '~/services/user.service'
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { InferSchemaType } from 'mongoose'
import { userSchema } from '~/models/user.model'
import { keyStoreSchema } from '~/models/keyStore.model'
import { IJwtPayload } from '~/utils/provider.jwt'
import { asyncHandler } from '~/helpers/asyncHandler'
import { AuthFailedError, BadRequestError, NotFoundError } from '~/Core/response.error'
interface IHEADER {
      CLIENT_ID: string
      AUTHORIZATION: string
}

const HEADER: IHEADER = {
      CLIENT_ID: 'x-client-id',
      AUTHORIZATION: 'authorization'
}

// type user = InferSchemaType<typeof userSchema>
interface IKey {
      key: Pick<InferSchemaType<typeof keyStoreSchema>, 'public_key'>
}

// const key: IRequestCustom = { keyStore: {} }

export interface IRequestCustom extends Request {
      user?: InferSchemaType<typeof userSchema>
      //   key: Pick<InferSchemaType<typeof keyStoreSchema>, 'public_key'>
      keyStore?: InferSchemaType<typeof keyStoreSchema>
      refresh_token?: string
}

// type IParamsAuthentication = {}

export const authentication = asyncHandler(async (req: IRequestCustom, res: Response, next: NextFunction) => {
      const client_id = req.headers[HEADER.CLIENT_ID] as string
      if (!client_id) throw new AuthFailedError({})

      const access_token = req.headers[HEADER.AUTHORIZATION] as string
      if (!access_token) throw new AuthFailedError({})

      // tim user
      const user = await UserService.findUserById({ _id: client_id })
      if (!user) throw new NotFoundError({ detail: 'Not found user' })
      // tim key
      const keyStore = await KeyStoreService.findKeyByUserId({ user_id: user._id })
      if (!keyStore) throw new NotFoundError({ detail: 'Not found key' })
      console.log('params', user, keyStore)
      // case: refresh_token
      if (req?.cookies['refresh_token']) {
            console.log()

            const refresh_token = req.cookies['refresh_token'] as string
            console.log('rf', refresh_token === keyStore.refresh_token, refresh_token, keyStore.refresh_token)
            if (refresh_token !== keyStore.refresh_token) {
                  req.user = user
                  req.keyStore = keyStore
                  console.log('prev')
                  return next()
            }
            console.log('next')
            jwt.verify(refresh_token, keyStore.private_key, (error, decode) => {
                  if (error) {
                        console.log('co loi', client_id, refresh_token, keyStore)
                        req.user = user

                        return next(error)
                  }
                  // console.log('decode::', decode)
                  const decodeType = decode as IJwtPayload
                  if (decodeType._id !== client_id) throw new AuthFailedError({})
                  req.user = user
                  req.keyStore = keyStore
                  req.refresh_token = refresh_token
            })
            return next()
            // if (!decode) throw new BadRequestError({})
            // if (decode._id !== client_id) throw new BadRequestError({})
      }

      // case authentication thông thường
      if (access_token) {
            console.log('at')
            jwt.verify(access_token, keyStore.public_key, (error, decode) => {
                  if (error) return next(error)
                  // console.log('decode::', decode)
                  const decodeType = decode as IJwtPayload
                  if (decodeType._id !== client_id) throw new AuthFailedError({ detail: 'client-id not match user' })
                  req.user = user
                  req.keyStore = keyStore
            })

            return next()
      }

      if (!access_token) {
            return next(new AuthFailedError({ detail: 'Token missing' }))
      }

      console.log('...')
      return next()
})

export default authentication
