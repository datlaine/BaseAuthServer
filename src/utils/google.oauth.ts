import axios from 'axios'
import { config } from 'dotenv'

config()
// const getOauthGooleToken = async (code: string) => {
//       const body = {
//             code,
//             client_id: process.env.GOOGLE_CLIENT_ID,
//             client_secret: process.env.GOOGLE_CLIENT_SECRET,
//             redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
//             grant_type: 'authorization_code'
//       }
//       const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
//             headers: {
//                   'Content-Type': 'application/x-www-form-urlencoded'
//             }
//       })
//       return data
// }

export const getOautGoogleToken = async (code: string) => {
      const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_AUTHORIZED_REDIRECT_URI } = process.env
      const body = {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_AUTHORIZED_REDIRECT_URI,
            grant_type: 'authorization_code'
      }

      const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })

      return data
}

export const getGoogleUser = async ({ id_token, access_token }: { id_token: string; access_token: string }) => {
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            params: { access_token, alt: 'json' },
            headers: { Authorization: `Bearer ${id_token}` }
      })
      console.log('data', data)
      return data
}
