import { Types } from 'mongoose'
import { commentModel } from '~/models/comment.model'

class CommentRepository {
      static async calcTotalAndAvgProduct({ product_id }: { product_id: Types.ObjectId }) {
            const result = await commentModel.aggregate([
                  { $match: { comment_product_id: product_id } },
                  {
                        $group: {
                              _id: null,
                              totalComment: { $sum: 1 },
                              avgProductVote: { $avg: '$comment_vote' }
                        }
                  }
            ])
            console.log({ result: result[0] })
            return result[0]
      }

      static async getCommentDetail({ product_id }: { product_id: Types.ObjectId }) {
            const result = await commentModel.aggregate([
                  { $match: { comment_product_id: product_id } },

                  {
                        $group: {
                              _id: '$comment_vote',
                              comment_count: { $sum: 1 }
                        }
                  },
                  {
                        $sort: { _id: -1 }
                  }
            ])

            return result
      }

      static async getTotalCommentPage({ product_id, user_id }: { product_id: Types.ObjectId; user_id?: Types.ObjectId }) {
            const result = await commentModel.aggregate([
                  { $match: { comment_product_id: product_id, comment_user_id: { $nin: [user_id] } } },
                  { $group: { _id: null, total: { $sum: 1 } } }
            ])
            return result[0]
      }

      static async getImageCommentAll({ product_id }: { product_id: Types.ObjectId }) {
            const result = await commentModel.aggregate([
                  { $match: { comment_product_id: product_id } },
                  { $unwind: '$comment_image' },

                  {
                        $group: {
                              _id: null,
                              comment_images: {
                                    $push: {
                                          user_id: '$comment_user_id',
                                          image: '$comment_image'
                                    }
                              }
                        }
                  },
                  {
                        $project: {
                              _id: 0, // Loại bỏ trường _id
                              comment_images: 1 // Chỉ bao gồm trường comment_image
                        }
                  }
            ])
            return result[0]
      }
}

export default CommentRepository
