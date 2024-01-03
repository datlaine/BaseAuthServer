import { NextFunction, Request, Response } from 'express'
import { ObjectId, Types } from 'mongoose'
import KeyStoreService from '~/services/keyStore.service'
import UserService from '~/services/user.service'

interface IHEADER {
      CLIENT_ID: string
      AUTHORIZATION: string
}

const HEADER: IHEADER = {
      CLIENT_ID: 'x-client-id',
      AUTHORIZATION: 'Authorization'
}

// type IParamsAuthentication = {}

const authentication = async (req: Request, res: Response, next: NextFunction) => {
      const client_id = req.headers[HEADER.CLIENT_ID] as string
      if (!client_id) return res.json('Not found clientId')

      const access_token = req.headers[HEADER.AUTHORIZATION] as string
      if (access_token) return res.json('Not found AT')

      if (req.cookies['refresh_token']) {
            // tim user
            const user = await UserService.findUserById({ _id: client_id })
            // tim key
            const keyStore = await KeyStoreService.findKeyByUserId({ user_id: user.id })
      }
}

export default authentication
