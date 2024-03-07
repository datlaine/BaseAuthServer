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
}

export default CommentRepository
