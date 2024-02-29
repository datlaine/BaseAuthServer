/* eslint-disable no-extra-boolean-cast */
import { NextFunction, Request, Response } from 'express'
import KeyStoreService from '~/services/keyStore.service'
import UserService from '~/services/user.service'
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { InferSchemaType } from 'mongoose'
import { userSchema } from '~/models/user.model'
import { keyStoreSchema } from '~/models/keyStore.model'
import { IJwtPayload } from '~/utils/provider.jwt'
import { asyncHandler } from '~/helpers/asyncHandler'
import { AuthFailedError, BadRequestError, ForbiddenError, NotFoundError } from '~/Core/response.error'
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

export interface IRequestCustom<T = any> extends Request {
      user?: InferSchemaType<typeof userSchema>
      //   key: Pick<InferSchemaType<typeof keyStoreSchema>, 'public_key'>
      keyStore?: InferSchemaType<typeof keyStoreSchema>
      refresh_token?: string
      body: T
}

// type IParamsAuthentication = {}

export const authentication = asyncHandler(async (req: IRequestCustom, res: Response, next: NextFunction) => {
      const client_id = req.headers[HEADER.CLIENT_ID]
      if (!client_id) {
            // res.clearCookie('refresh_token')
            throw new ForbiddenError({ detail: 'Phiên đăng nhập hết hạn client' })
      }
      const access_token = req.headers[HEADER.AUTHORIZATION] as string
      // eslint-disable-next-line no-extra-boolean-cast
      if (!access_token) throw new AuthFailedError({ detail: 'Not found token' })

      // tim user
      const user = await UserService.findUserById({ _id: client_id as string })
      if (!user) throw new ForbiddenError({ detail: 'Không tìm thấy tài khoản' })

      // tim key
      const keyStore = await KeyStoreService.findKeyByUserId({ user_id: user._id })
      if (!keyStore) throw new ForbiddenError({ detail: 'Phiên đăng nhập hết hạn key' })

      // case: refresh_token

      if (req.originalUrl === '/v1/api/auth/rf') {
            // console.log({ refresf: req?.cookies['refresh_token'], keyStore })
            if (!req?.cookies['refresh_token']) {
                  return next(new ForbiddenError({ detail: 'Token không đúng1' }))
            }

            if (req?.cookies['refresh_token'] || req.originalUrl === '/v1/api/auth/rf') {
                  const refresh_token = (req.cookies['refresh_token'] as string) || 'none'

                  jwt.verify(refresh_token, keyStore.private_key, (error, decode) => {
                        if (error) {
                              // req.user = user
                              return next(new ForbiddenError({ detail: 'Token không đúng12' }))
                        }
                        // console.log('decode::', decode)
                        const decodeType = decode as IJwtPayload
                        // if (decodeType._id !== client_id) throw new AuthFailedError({})
                        req.user = user
                        req.keyStore = keyStore
                        req.refresh_token = refresh_token
                  })
                  return next()
            }
      }
      // case authentication thông thường
      if (access_token) {
            const token = access_token.split(' ')[1]

            console.log('at')
            jwt.verify(token, keyStore.public_key, (error, decode) => {
                  if (error) {
                        return next(new AuthFailedError({ detail: 'Token hết hạn' }))
                  }
                  // console.log('decode::', decode)
                  const decodeType = decode as IJwtPayload
                  if (decodeType._id !== client_id) throw new AuthFailedError({ detail: 'client-id not match user' })
                  req.user = user
                  req.keyStore = keyStore
            })

            return next()
      }

      console.log('...')
      return next()
})

export default authentication
