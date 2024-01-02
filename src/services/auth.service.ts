import { NextFunction, Request, Response } from 'express'
import UserService from './user.service'
import SelecetData from '~/utils/SelectData'
import SelectData from '~/utils/SelectData'
import { convertPlantObject } from '~/utils/convert'

class AuthService {
      static async register(req: Request, res: Response) {
            const { email, password } = req.body
            const foundEmail = await UserService.findUserByEmail({ email })
            console.log(foundEmail)
            if (foundEmail) return res.json('Email đã được đăng kí')
            const createUser = await UserService.createUser({ email, password })
            return SelectData.omit(convertPlantObject(createUser as object), [
                  'password',
                  'createdAt',
                  'updatedAt',
                  '__v'
            ])
            // return createUser
      }
}

export default AuthService
