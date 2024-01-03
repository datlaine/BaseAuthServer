import jwt from 'jsonwebtoken'

interface IPayloadJWT {
      email: string
      _id: string
}

interface IKeySecret {
      public_key: string
      private_key: string
}

export interface IToken {
      access_token: string
      refresh_token: string
}

class ProviderJWT {
      static async createPairToken<T>({ payload, key }: { payload: IPayloadJWT; key: IKeySecret }): Promise<T> {
            try {
                  const access_token = jwt.sign(payload, key.public_key)
                  const refresh_token = jwt.sign(payload, key.private_key)

                  return { access_token, refresh_token }
            } catch (e) {
                  return e
            }
      }
}

export default ProviderJWT
