import axios from 'axios'
import { AuthApiResponse, IApiResponseError } from 'types/apiResponseTypes'

class AuthService {
  async signup(data) {
    const payload = await axios.post('/api/auth/signup', data)
    return payload.data
  }

  async signin(data) {
    const payload = await axios.post('/api/auth/sessions', data)
    return payload.data
  }

  async sendVerifyCode(email) {
    const randomOtp = Math.floor(1000 + Math.random() * 9000)
    const payload = await axios.post('/api/auth/sendVerificationCode', {
      code: randomOtp,
      email,
    })
    return payload.data
  }

  async verifyEmail(data) {
    const payload = await axios.post('/api/auth/verifyEmail', data)
    return payload.data as AuthApiResponse.IVerifyEmail | IApiResponseError
  }
}

export default new AuthService()
