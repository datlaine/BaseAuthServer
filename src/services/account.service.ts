import { IRequestCustom } from '~/middlewares/authentication'
import SelectData from '~/utils/SelectData'
import Convert from '~/utils/convert'
import UserService from './user.service'
import { userAgent } from 'next/server'
import userModel from '~/models/user.model'
import { NextFunction } from 'express'
import path from 'path'
import cloudinary from '~/configs/cloundinary.config'
import { config } from 'dotenv'
import uploadToCloudinary from '~/utils/uploadCloudinary'
import AccountRepository from '~/repositories/account.repositort'

config()
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

      static async updateAvatar(req: IRequestCustom) {
            const user = req.user

            if (!user?.avatar.secure_url) {
                  const result = await uploadToCloudinary(req?.file as Express.Multer.File, user?._id)
                  console.log({ result })
                  const update = await userModel.findOneAndUpdate(
                        {
                              _id: user?._id
                        },
                        {
                              $set: { avatar: { secure_url: result.secure_url, public_id: result.public_id, date_update: Date.now() } }
                        },
                        { new: true, upsert: true }
                  )
                  return { user: update }
            } else {
                  const folder = `users/${user.id}/avatar`
                  const result = await uploadToCloudinary(req?.file as Express.Multer.File, folder)
                  console.log({ result })
                  const update = await userModel.findOneAndUpdate(
                        {
                              _id: user?._id
                        },
                        {
                              $addToSet: {
                                    avatar_used: {
                                          public_id: user?.avatar.public_id,
                                          secure_url: user?.avatar.secure_url,
                                          date_update: user.avatar.date_update
                                    }
                              },
                              $set: { avatar: { secure_url: result.secure_url, public_id: result.public_id, date_update: Date.now() } }
                        },
                        { new: true, upsert: true }
                  )
                  return { user: update }
            }
      }

      static async getAllAvatar(req: IRequestCustom) {
            const user = req.user
            const foundAllAvatar = await userModel.find({ _id: user?._id }, { avatar_used: 1 })
            console.log({ foundAllAvatar })
            return { avatar_used: foundAllAvatar[0].avatar_used }
      }

      static async deleteAvatarUsed(req: IRequestCustom) {
            const user = req.user
            const public_id = req.body.public_id
            const result = await cloudinary.uploader.destroy(public_id)
            console.log({ result })
            const objAvatarUsed = await AccountRepository.findSecureUrlWithPublicId(public_id)
            const update = await userModel.findOneAndUpdate(
                  {
                        _id: user?._id
                  },
                  {
                        $pull: { avatar_used: { public_id, secure_url: objAvatarUsed?.avatar.secure_url } }
                  },
                  { new: true, upsert: true }
            )
            return { user: update }
      }

      static async deleteAvatar(req: IRequestCustom) {
            const user = req.user
            const update = await userModel.findOneAndUpdate(
                  {
                        _id: user?._id
                  },
                  {
                        $addToSet: {
                              avatar_used: {
                                    public_id: user?.avatar.public_id,
                                    secure_url: user?.avatar.secure_url,
                                    date_update: user?.avatar.date_update
                              }
                        },
                        $unset: { avatar: 1 }
                  },
                  { new: true, upsert: true }
            )
            return { user: update }
      }

      static async updatePassword(req: IRequestCustom) {}
}

export default AccountService
