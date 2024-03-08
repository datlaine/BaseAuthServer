import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { HEADER, IRequestCustom } from '~/middlewares/authentication'
import { commentModel } from '~/models/comment.model'
import { notificationModel } from '~/models/notification.model'
import productModel from '~/models/product.model'
import CommentRepository from '~/repositories/comment.repository'
import { renderNotificationSystem } from '~/utils/notification.util'
import sleep from '~/utils/sleep'
import uploadToCloudinary from '~/utils/uploadCloudinary'

export type StateFile = 'Full' | 'no-file'

export type AddCommentParam = {
      state: 'Full' | 'no-file'
      content: string
      file: File | undefined
      countStar: number
      product_id: string
}

class CommentService {
      static async addComment(req: IRequestCustom) {
            const { content, countStar, product_id } = req.body
            const { state } = req.query
            const { user } = req

            const commentQuery = {
                  comment_product_id: new Types.ObjectId(product_id),

                  comment_user_id: new Types.ObjectId(user?._id)
            }
            let commentUpdate = {}
            const option = { new: true, upsert: true }

            if (state === 'file') {
                  const { file } = req

                  if (!file) throw new BadRequestError({ detail: 'Missing File' })
                  const folder = `user/${user?._id}/comment`
                  const result = await uploadToCloudinary(file as Express.Multer.File, folder)
                  commentUpdate = {
                        $set: {
                              comment_user_id: new Types.ObjectId(user?._id),
                              comment_content: content ? content : '',
                              comment_product_id: new Types.ObjectId(product_id),
                              comment_vote: Number(countStar),
                              comment_image: { secure_url: result.secure_url, public_id: result.public_id }
                        }
                  }
            }

            if (state === 'no-file') {
                  commentUpdate = {
                        $set: {
                              comment_user_id: new Types.ObjectId(user?._id),
                              comment_content: content || '',
                              comment_product_id: new Types.ObjectId(product_id),
                              comment_vote: Number(countStar)
                        }
                  }
            }

            const commentDocument = await commentModel.findOneAndUpdate(commentQuery, commentUpdate, option)
            const calcVoteAgain: { avgProductVote: number; totalComment: number } = await CommentRepository.calcTotalAndAvgProduct({
                  product_id: new Types.ObjectId(product_id)
            })

            const productQuery = { _id: new Types.ObjectId(product_id) }
            const productUpdate = {
                  $set: { product_votes: Number(calcVoteAgain?.avgProductVote || countStar) }
            }
            const productOption = { new: true, upsert: true }
            const productDoc = await productModel.findOneAndUpdate(productQuery, productUpdate, productOption)

            const notificationQuery = { notification_user_id: new Types.ObjectId(user?._id) }
            const notificationUpdate = { notification_message: renderNotificationSystem('Bạn vừa đăng một nhận xét') }
            const notificationOption = { new: true, upsert: true }

            await notificationModel.findOneAndUpdate(notificationQuery, notificationUpdate, notificationOption)

            return { comment: commentDocument }
      }

      static async getMeComment(req: IRequestCustom) {
            const { user } = req
            const { product_id } = req.query
            const commentQuery = {
                  comment_user_id: new Types.ObjectId(user?._id),
                  comment_product_id: new Types.ObjectId(product_id as string)
            }
            const comment = await commentModel
                  .findOne(commentQuery)
                  .populate({ path: 'comment_product_id', select: { product_name: 1, product_thumb_image: 1 } })
                  .populate({
                        path: 'comment_user_id',
                        select: { avatar: 1, avatar_default_url: 1, createAt: 1, createdAt: 1, fullName: 1, nickName: 1, email: 1 }
                  })
            console.log({ comment })

            const total = await commentModel.aggregate([
                  {
                        $match: {
                              comment_product_id: new Types.ObjectId(product_id as string)
                        }
                  },

                  {
                        $group: {
                              _id: null,
                              tongComment: { $sum: 1 },
                              trungBinh: { $avg: '$comment_vote' }
                        }
                  }
            ])
            const result = await commentModel.aggregate([
                  {
                        $match: {
                              comment_product_id: new Types.ObjectId(product_id as string)
                        }
                  },

                  {
                        $group: {
                              _id: '$comment_vote',
                              count: { $sum: 1 }
                        }
                  }
            ])

            const avg = await commentModel.aggregate([
                  {
                        $match: {
                              comment_product_id: new Types.ObjectId(product_id as string)
                        }
                  },
                  {
                        $group: {
                              _id: null,
                              trungBinh: { $avg: '$comment_vote' }
                        }
                  }
            ])
            // console.log({ total, result, avg })

            return { comment }
      }

      static async getAllCommentProduct(req: IRequestCustom) {
            const { product_id, page, limit } = req.query
            const client_id = req.headers[HEADER.CLIENT_ID]

            const LIMIT = Number(limit)
            const skip = LIMIT * (Number(page) - 1)

            const commentPopulate = {
                  path: 'comment_user_id',
                  select: { avatar: 1, nickName: 1, email: 1, fullName: 1, avatar_default_url: 1, createdAt: 1 }
            }

            const total: { total: number } = await CommentRepository.getTotalCommentPage({
                  product_id: new Types.ObjectId(product_id as string)
            })
            console.log({ total })

            if (client_id) {
                  const total: { total: number } = await CommentRepository.getTotalCommentPage({
                        product_id: new Types.ObjectId(product_id as string),
                        user_id: new Types.ObjectId(client_id as string)
                  })
                  console.log({ total })
                  const commentQuery = {
                        comment_product_id: new Types.ObjectId(product_id as string),
                        comment_user_id: { $nin: [new Types.ObjectId(client_id as string)] }
                  }
                  const commentDocument = await commentModel
                        .find(commentQuery)
                        .populate(commentPopulate)
                        .sort({ comment_date: -1 })
                        .skip(skip)
                        .limit(LIMIT)
                  return { comments: commentDocument, total: total?.total || 0 }
            }

            const commentQuery = {
                  comment_product_id: new Types.ObjectId(product_id as string)
            }

            const commentDocument = await commentModel
                  .find(commentQuery)
                  .populate(commentPopulate)
                  .sort({ comment_date: -1 })
                  .skip(skip)
                  .limit(LIMIT)

            return { comments: commentDocument, total: total?.total || 0 }
      }

      static async getAllCommentImage(req: IRequestCustom) {
            const { product_id } = req.query

            const getAllCommentImage: { comment_images: [] } = await CommentRepository.getImageCommentAll({
                  product_id: new Types.ObjectId(product_id as string)
            })

            return { comment_images: getAllCommentImage?.comment_images || [] }
      }
}

export default CommentService
