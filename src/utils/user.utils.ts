import { Types } from 'mongoose'
import userModel from '~/models/user.model'

export const userProductSeeUnique = async ({ user_id, product_id }: { user_id: Types.ObjectId; product_id: Types.ObjectId }) => {
      const userDocument = await userModel.findOne({ _id: user_id })

      if (userDocument) {
            if (!userDocument.product_see.length) {
                  const user = await userModel.findOneAndUpdate({ _id: user_id }, { $push: { product_see: product_id } })
            } else {
                  const foundProductId = userDocument.product_see.findIndex((p) => p.toString() === product_id.toString())
                  console.log({ foundProductId })
                  if (foundProductId === -1) {
                        const user = await userModel.findOneAndUpdate({ _id: user_id }, { $push: { product_see: product_id } })
                  }
            }
      }
}
