import { Router } from 'express'
import authRouter from './auth'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()
const router = Router()

//auth
router.use('/v1/api/auth', authRouter)
router.get('/getData', (req, res, next) => {
      res.json({ data: ['1', '2', '3', '4'] })
})

const getOauthGooleToken = async (code: any) => {
      const body = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
            grant_type: 'authorization_code'
      }
      const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
            headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
            }
      })
      return data
}

const getGoogleUser = async ({ id_token, access_token }: { id_token: string; access_token: string }) => {
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            params: {
                  access_token,
                  alt: 'json'
            },
            headers: {
                  Authorization: `Bearer ${id_token}`
            }
      })
      return data
}

router.get('/api/oauth/google', async (req, res, next) => {
      const { code } = req.query
      const data = await getOauthGooleToken(code) // Gửi authorization code để lấy Google OAuth token
      const { id_token, access_token } = data // Lấy ID token và access token từ kết quả trả về
      const googleUser = await getGoogleUser({ id_token, access_token }) // Gửi Google OAuth token để lấy thông tin người dùng từ Google

      // Kiểm tra email đã được xác minh từ Google
      if (!googleUser.verified_email) {
            return res.status(403).json({
                  message: 'Google email not verified'
            })
      }

      const manual_access_token = jwt.sign({ email: googleUser.email, type: 'access_token' }, 'datlai304', {
            expiresIn: '15m'
      })
      const manual_refresh_token = jwt.sign({ email: googleUser.email, type: 'refresh_token' }, 'datlai304', {
            expiresIn: '100d'
      })
      // console.log('code', code)
      // return res.json(googleUser)
      return res.redirect(`http://localhost:3000/login/oauth?access_token=${manual_access_token}&refresh_token=${manual_refresh_token}`)
})

export default router
