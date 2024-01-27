import userModel from '~/models/user.model'

class AccountRepository {
      static async findSecureUrlWithPublicId(public_id: string) {
            const foundSecureUrl = userModel.findOne({ avatar: { public_id } }).lean()
            return foundSecureUrl
      }
}

export default AccountRepository
