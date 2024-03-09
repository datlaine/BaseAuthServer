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

export type TotalPage = {
      total: number
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

            return { comment }
      }

      static async getAllCommentMe(req: IRequestCustom) {
            const { user } = req
            const { page, limit } = req.query

            const LIMIT = Number(limit)
            const SKIP = LIMIT * (Number(page) - 1)

            const commentQuery = { comment_user_id: new Types.ObjectId(user?._id) }
            const commentPopulateUser = {
                  path: 'comment_user_id',
                  select: { avatar: 1, nickName: 1, email: 1, fullName: 1, avatar_default_url: 1, createdAt: 1 }
            }

            const commentPopulateProduct = {
                  path: 'comment_product_id',
                  select: { product_name: 1, product_thumb_image: 1, _id: 1 }
            }

            const comments = await commentModel
                  .find(commentQuery)
                  .skip(SKIP)
                  .limit(LIMIT)
                  .populate(commentPopulateUser)
                  .populate(commentPopulateProduct)
                  .sort({ comment_date: -1 })

            const total: TotalPage = await CommentRepository.getAllCommentMe({ comment_user_id: new Types.ObjectId(user?._id) })
            return { comments, total: total?.total || 0 }
      }

      static async getAllCommentProduct(req: IRequestCustom) {
            const { product_id, page, limit } = req.query
            const client_id = req.headers[HEADER.CLIENT_ID]
            console.log({ client_id })
            const LIMIT = Number(limit)
            const skip = LIMIT * (Number(page) - 1)

            const commentPopulate = {
                  path: 'comment_user_id',
                  select: { avatar: 1, nickName: 1, email: 1, fullName: 1, avatar_default_url: 1, createdAt: 1 }
            }

            const total: TotalPage = await CommentRepository.getTotalCommentPage({
                  product_id: new Types.ObjectId(product_id as string)
            })

            if (client_id) {
                  const total: { total: number } = await CommentRepository.getTotalCommentPage({
                        product_id: new Types.ObjectId(product_id as string),
                        user_id: new Types.ObjectId(client_id as string)
                  })
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

      static async geAllCommentHasImage(req: IRequestCustom) {
            const { product_id, limit, page, minVote = 1, maxVote = 5 } = req.query

            const LIMIT = Number(limit)
            const SKIP = LIMIT * (Number(page) - 1)
            const MIN_VOTE = Number(minVote)
            const MAX_VOTE = Number(maxVote)
            let result
            const user_id = req.headers[HEADER.CLIENT_ID] as string
            if (user_id) {
                  const commentQuery = {
                        comment_image: { $exists: true, $ne: [] },
                        comment_product_id: new Types.ObjectId(product_id as string),
                        comment_vote: { $gte: MIN_VOTE, $lte: MAX_VOTE },
                        comment_user_id: { $nin: [new Types.ObjectId(user_id as string)] }
                  }

                  result = await commentModel
                        .find(commentQuery)
                        .populate({
                              path: 'comment_user_id',
                              select: { name: 1, nickName: 1, fullName: 1, email: 1, avatar: 1, avatar_default_url: 1, createdAt: 1 }
                        })
                        .skip(SKIP)
                        .sort({ comment_vote: -1 })
                        .limit(LIMIT)
            }

            if (!user_id) {
                  const commentQuery = {
                        comment_image: { $exists: true, $ne: [] },
                        comment_product_id: new Types.ObjectId(product_id as string),
                        comment_vote: { $gte: MIN_VOTE, $lte: MAX_VOTE }
                  }

                  result = await commentModel
                        .find(commentQuery)
                        .populate({
                              path: 'comment_user_id',
                              select: { name: 1, nickName: 1, fullName: 1, email: 1, avatar: 1, avatar_default_url: 1, createdAt: 1 }
                        })
                        .skip(SKIP)
                        .sort({ comment_vote: -1 })
                        .limit(LIMIT)
            }

            // if (client_id) {

            const total: TotalPage = (await CommentRepository.getTotalCommentHasImage({
                  product_id: new Types.ObjectId(product_id as string),
                  user_id: new Types.ObjectId(user_id),
                  minVote: MIN_VOTE,
                  maxVote: MAX_VOTE
            })) as unknown as TotalPage

            return { comments: result, total: total?.total || 0 }
      }

      static async geAllCommentFollowLevel(req: IRequestCustom) {
            const { product_id, minVote = 1, maxVote = 5, page, limit } = req.query
            console.log({ minVote, maxVote })
            const LIMIT = Number(limit)
            const PAGE = Number(page)
            const SKIP = LIMIT * (PAGE - 1)
            const MIN_VOTE = Number(minVote)
            const MAX_VOTE = Number(maxVote)
            let result
            const user_id = req.headers[HEADER.CLIENT_ID] as string
            if (user_id) {
                  const commentQuery = {
                        comment_image: { $exists: true, $ne: [] },
                        comment_product_id: new Types.ObjectId(product_id as string),
                        comment_vote: { $gte: MIN_VOTE, $lte: MAX_VOTE },
                        comment_user_id: { $nin: [new Types.ObjectId(user_id as string)] }
                  }

                  result = await commentModel
                        .find(commentQuery)
                        .populate({
                              path: 'comment_user_id',
                              select: { name: 1, nickName: 1, fullName: 1, email: 1, avatar: 1, avatar_default_url: 1, createdAt: 1 }
                        })
                        .skip(SKIP)
                        .sort({ comment_vote: -1 })
                        .limit(LIMIT)
            }
            if (!user_id) {
                  const commentQuery = {
                        comment_product_id: new Types.ObjectId(product_id as string),
                        comment_vote: { $gte: MIN_VOTE, $lte: MAX_VOTE }
                  }
                  result = await commentModel
                        .find(commentQuery)
                        .sort({ comment_vote: -1 })
                        .populate({
                              path: 'comment_user_id',
                              select: { name: 1, nickName: 1, email: 1, fullName: 1, avatar: 1, avatar_default_url: 1, createdAt: 1 }
                        })
                        .skip(SKIP)
                        // .sort({ comment_vote: -1 })
                        .limit(LIMIT)
            }

            const total: TotalPage = (await CommentRepository.getTotalCommentFilterLevel({
                  product_id: new Types.ObjectId(product_id as string),
                  user_id: new Types.ObjectId(user_id),
                  minVote: MIN_VOTE,
                  maxVote: MAX_VOTE
            })) as unknown as TotalPage

            return { comments: result, total: total?.total || 0 }
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
