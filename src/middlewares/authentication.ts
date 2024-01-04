import { NextFunction, Request, Response } from 'express'
import KeyStoreService from '~/services/keyStore.service'
import UserService from '~/services/user.service'
import jwt from 'jsonwebtoken'
import mongoose, { InferSchemaType, Types } from 'mongoose'
import { UserDocument, userSchema } from '~/models/user.model'
import { keyStoreSchema } from '~/models/keyStore.model'
import { JwtPayload } from '~/utils/provider.jwt'
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

export const authentication = async (req: IRequestCustom, res: Response, next: NextFunction) => {
      const client_id = req.headers[HEADER.CLIENT_ID] as string
      if (!client_id) return res.json('Not found clientId')

      const access_token = req.headers[HEADER.AUTHORIZATION] as string
      if (!access_token) return res.json('Not found AT')

      // tim user
      const user = await UserService.findUserById({ _id: client_id })
      // tim key
      const keyStore = await KeyStoreService.findKeyByUserId({ user_id: user._id })

      if (req?.cookies['refresh_token']) {
            const refresh_token = req.cookies['refresh_token'] as string
            console.log('rf', refresh_token, keyStore.private_key)

            const decode = jwt.verify(refresh_token, keyStore.private_key) as JwtPayload
            if (decode._id !== client_id) {
                  throw Error('Client id is vaild')
            }
            req.user = user
            req.keyStore = keyStore
            req.refresh_token = refresh_token
            return next()
      }

      if (access_token) {
            console.log('at', access_token, keyStore.private_key)

            const decode = jwt.verify(access_token, keyStore.public_key) as JwtPayload
            if (decode._id !== client_id) {
                  throw Error('Client id is vaild')
            }
            req.user = user
            req.keyStore = keyStore

            return next()
      }
}

export default authentication
