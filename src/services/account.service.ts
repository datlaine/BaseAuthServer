import { IRequestCustom } from '~/middlewares/authentication'
import SelectData from '~/utils/SelectData'
import Convert from '~/utils/convert'
import UserService from './user.service'
import { userAgent } from 'next/server'
import userModel from '~/models/user.model'

class AccountService {
      static async getMe(req: IRequestCustom) {
            return {
                  user: SelectData.omit(Convert.convertPlantObject(req.user as object), ['password', 'createdAt', 'updatedAt'])
            }
      }
      static async updateInfo(req: IRequestCustom) {
            const user = req.user
            console.log(req.body.birth)
            const update = await userModel.findOneAndUpdate(
                  { _id: user?._id },
                  { $set: { bob: req.body.birth, gender: req.body.gender, fullName: req.body.fullName, nickName: req.body.nickName } },
                  { new: true, upsert: true }
            )
            return {
                  user: update
            }
      }
}

export default AccountService
