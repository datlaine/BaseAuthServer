import bcrypt from 'bcrypt'
import { AuthFailedError } from '~/Core/response.error'

export default class ProviderBcrypt {
      static async comparePass({ password, hashPassword }: { password: string | Buffer; hashPassword: string }) {
            try {
                  const compare = await bcrypt.compare(password, hashPassword.trim())
                  return compare
            } catch (e) {
                  return new AuthFailedError({ detail: 'Password wrong' })
            }
      }
}
