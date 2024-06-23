import jwt from 'jsonwebtoken'

export interface IJwtPayload {
      email: string
      _id: string
      roles: string[]
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
      static createPairToken({ payload, key }: { payload: IJwtPayload; key: IKeySecret }): IToken | unknown {
            try {
                  const access_token = jwt.sign(payload, key.public_key, { expiresIn: '30m' })
                  const refresh_token = jwt.sign(payload, key.private_key, { expiresIn: '1 day' })
                  return { access_token, refresh_token }
            } catch (e) {
                  console.log('e:', e)
                  return e
            }
      }
}

export default ProviderJWT
