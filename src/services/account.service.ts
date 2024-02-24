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
import { Types } from 'mongoose'

config()
class AccountService {
      static async getMe(req: IRequestCustom) {
            return {
                  user: SelectData.omit(Convert.convertPlantObject(req.user as object), ['password', 'createdAt', 'updatedAt'])
            }
      }
      static async updateInfo(req: IRequestCustom) {
            const user = req.user
            const update = await userModel.findOneAndUpdate(
                  { _id: user?._id },
                  { $set: { bob: req.body.birth, gender: req.body.gender, fullName: req.body.fullName, nickName: req.body.nickName } },
                  { new: true, upsert: true }
            )

            console.log({ update })
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

      static async addAddress(req: IRequestCustom) {
            const { user } = req
            const { addressPayload } = req.body
            console.log({ body: req.body })

            const query = { _id: new Types.ObjectId(user?._id) }
            const update = { $addToSet: { user_address: addressPayload } }
            const option = { new: true, upsert: true }

            const updateUser = await userModel.findOneAndUpdate(query, update, option)

            return { user: updateUser }
      }

      static async setAddressDefault(req: IRequestCustom) {
            const { user } = req
            const { addressPayload } = req.body
            await userModel.updateMany({ _id: new Types.ObjectId(user?._id) }, { 'user_address.$[].address_default': false })
            const query = { _id: new Types.ObjectId(user?._id), 'user_address._id': addressPayload._id }
            const update = { 'user_address.$.address_default': true }
            const option = { new: true, upsert: true }

            const userUpdate = await userModel.findOneAndUpdate(query, update, option)

            return { user: userUpdate }
      }

      static async deleteAddress(req: IRequestCustom) {
            const { user } = req
            const { address_id } = req.params

            const query = { _id: new Types.ObjectId(user?._id), 'user_address._id': address_id }
            const update = { $pull: { user_address: { _id: address_id } } }
            const option = { new: true, upsert: true }

            const updateUser = await userModel.findOneAndUpdate(query, update, option)

            return { user: updateUser }
      }
}

export default AccountService
