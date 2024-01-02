import userModel, { UserDocument } from '~/models/user.model'
import bcrypt from 'bcrypt'
import { Document, Types } from 'mongoose'

type UserInfo = {
      email: string
      password: string
}

class UserService {
      static async createUser({ email, password }: UserInfo) {
            const hashPassword = await bcrypt.hash(password, 8)
            const user = await userModel.create({ email, password: hashPassword })
            if (!user) return 'Tạo user thất bại'
            return user // object
      }

      static async findUserByEmail({ email }: Pick<UserInfo, 'email'>) {
            const foundEmail = await userModel.findOne({ email }).lean()
            return foundEmail ? foundEmail : null
      }
}

export default UserService
