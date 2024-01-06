import keyStoreModel from '~/models/keyStore.model'

interface IKeyStore {
      user_id: string
      public_key: string
      private_key: string
      refresh_token: string
      refresh_token_used?: string[]
      access_token: string
}

class KeyStoreService {
      static async findKeyByUserId({ user_id }: { user_id: string }) {
            const foundKey = await keyStoreModel.findOne({ user_id }).lean()
            if (!foundKey) throw Error('User_id not match key')
            return foundKey
      }

      static async createKeyStoreUser({
            user_id,
            private_key,
            public_key,
            refresh_token,
            access_token,
            refresh_token_used = []
      }: IKeyStore) {
            const keyStore = keyStoreModel.create({
                  user_id,
                  private_key,
                  public_key,
                  refresh_token,
                  access_token,

                  refresh_token_used
            })

            if (!keyStore) throw Error('Create key faild')

            return (await keyStore).toObject()
      }

      static async updateKey() {}
}

export default KeyStoreService
