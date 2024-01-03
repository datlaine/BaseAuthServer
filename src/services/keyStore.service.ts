import { Types } from 'mongoose'
import keyStoreModel from '~/models/keyStore.model'

class KeyStoreService {
      static async findKeyByUserId({ user_id }: { user_id: string }) {
            const foundKey = await keyStoreModel.findById(user_id).lean()
            if (!foundKey) throw Error('User_id not match key')
            return foundKey
      }
}

export default KeyStoreService
