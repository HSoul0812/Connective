import InputField from '../../components/input-field'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { withIronSession } from 'next-iron-session'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/assets/logo.svg'
import Head from 'next/head'
import * as Routes from '../../util/routes'
import GoogleSsoDivider from '../../components/divider/orDivider'
import AuthButton from '../../components/button/AuthButton'
import LoginSidebar from '../../components/login-sidebar'
import EmailVerification from '../../components/dailog/EmailVerification'
import ResetPassword from './resetpassword/[email]/[token]'
import {
  AuthApiResponse,
  IApiResponseError,
} from '../../types/apiResponseTypes'

export default function SignIn() {
  const router = useRouter()
  const { error } = router.query
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [resetPassword, setResetPassword] = useState<boolean>(false)
  const [emailNotVerified, setEmailNotVerified] = useState<boolean>(false)
  const [otpCode, setOtpCode] = useState<string>('')
  const [otpCodeforResetPassword, setOtpCodeforResetPassword] = useState<
    string
  >('')
  const [otpError, setOtpError] = useState<string>('')
  const [expiredError, setExpiredError] = useState<boolean>(false)

  const verifyEmail = async () => {
    const verifiedEmail: AuthApiResponse.IVerifyEmail | IApiResponseError = (
      await axios({
        method: 'post',
        url: '/api/auth/verifyEmail',
        data: { code: otpCode, email },
      })
    ).data
    if (!verifiedEmail.success) {
      if (verifiedEmail.type == 'IApiResponseError') {
        if (verifiedEmail.error === 'Incorrect verification code') {
          setOtpError('Incorrect verification code')
        } else {
          setOtpError(verifiedEmail.error as string)
        }
      }
    } else {
      setOtpError(null)
      setEmailError(null)
      setEmailNotVerified(false)
    }
  }

  useEffect(() => {
    if (otpCode && emailNotVerified) {
      verifyEmail()
    }
  }, [otpCode, emailNotVerified])

  useEffect(() => {
    if (!emailNotVerified) {
      verifyEmail()
    }
  }, [otpCode, emailNotVerified])

  useEffect(() => {
    if (error) {
      setPasswordError("You didn't sign up with Google SSO.")
    }
  }, [error])

  const submitAccount = async () => {
    if (email == '') {
      setEmailError('You must enter an email.')
      setPasswordError('')
      return
    }
    if (password == '') {
      setPasswordError('You must enter a password.')
      setEmailError('')
      return
    }

    setPasswordError('')
    setEmailError('')

    await axios({
      method: 'post',
      url: '/api/auth/sessions',
      data: { email, password },
    })
      .then((res) => {
        const data: AuthApiResponse.ISessions = res.data
        if (res.status == 201) {
          data.accountExists
            ? router.push(Routes.DISCOVER)
            : router.push(Routes.CREATEPROFILE)
        }
      })
      .catch((e) => {
        if (e.response.data.error == 'Email not verified') {
          setEmailError('Email not verified')
          setEmailNotVerified(true)
        }
        if (
          e.response.status == 403 ||
          e.response.data.error == 'Account does not exist'
        )
          setPasswordError('Incorrect email or password')
      })
  }

  const forgotPassword = async () => {
    if (email == '') {
      setEmailError('You must enter an email.')
      setPasswordError('')
      return
    }

    setPasswordError('')
    setEmailError('')

    await axios({
      method: 'post',
      url: '/api/auth/sendPasswordResetEmail',
      data: { email },
    })
      .then(async (res) => {
        if (res) setResetPassword(true)
        if (res.data.error === 'You can send only 2 requests in 15 minutes') {
          setExpiredError(true)
        } else {
          setExpiredError(false)
        }
      })
      .catch(async (e) => {
        if (
          e.response.status == 500 ||
          e.response.data.error == 'Account does not exist'
        )
          setEmailError('Incorrect email')
      })
  }

  const showPasswordHandler = () => {
    setShowPassword((prevState) => !prevState)
  }

  return (
    <main className="flex flex-row-reverse gap-[80px] 2bp:gap-[40px] justify-center">
      <Head>
        <title>Signin - Conenctive</title>
      </Head>
      <LoginSidebar />

      <div className="flex flex-col max-w-[704px] w-[100%] font-[Montserrat] my-[32px] ml-[64px]">
        <div className="flex justify-between items-center mb-5">
          <div className="cursor-pointer">
            <Link href="https://www.connective-app.xyz">
              <Image
                src={logo}
                alt="Connective logo"
                width="173px"
                height="41px"
              />
            </Link>
          </div>

          <p className="font-[Poppins] font-normal text-[14px] leading-[36px] text-center text-[#414141] 1bp:text-[16px]">
            Don't have an account?{' '}
            <Link href="/auth/signup">
              <span className="text-purple cursor-pointer">Sign up!</span>
            </Link>
          </p>
        </div>
        <div className="mt-5">
          <div className="text-center">
            <p className="font-bold text-[44px] leading-[39px] text-[#0D1011]">
              Welcome Back!
            </p>

            <p className="text-[#414141] my-[12px] font-normal text-[16px] leading-[37px] font-[Poppins] 1bp:text-[18px] mb-10">
              Login into your account
            </p>

            {/* <div
              className="h–[47px] flex flex-row items-center w-[100%] bg-[#EFEFEF] mt-[40px] justify-center rounded-[8px] gap-[11.67px] py-[14.47px] cursor-pointer"
              onClick=""
            >
              <Image
                className="w-[16.67px] h-[16.67px] 1bp:w-[20px] 1bp:h-[20px]"
                src={googleIcon}
                alt="Google"
                width="16.67px"
                height="16.67px"
              />
              <p  className="font-normal text-[12px] leading-[18px] text-[#0D1011] font-[Poppins] 1bp:text-[14px]">
                Login with with Google
              </p>
            </div>
            <div  className="flex flex-row items-center gap-[12px] mt-[24px]">
              <div  className="w-[100%] h-[1px] bg-[#D9D9D9]" />
              <div>
                <p  className="font-normal text-[12px] leading-[18px] text-[#414141] font-[Poppins] 1bp:text-[14px]">
                  or
                </p>
              </div>
              <div  className="w-[100%] h-[1px] bg-[#D9D9D9]" />
            </div> */}
          </div>

          <AuthButton isSignUp={false} type="google" />
          <GoogleSsoDivider />

          <div className="relative flex flex-col gap-5 mt-10 items-center">
            <InputField
              name={'E-mail'}
              placeholder={'Enter your email'}
              updateValue={setEmail}
              errorText={emailError}
            ></InputField>

            <InputField
              name={'Password'}
              placeholder={'Enter password'}
              password={!showPassword ? true : false}
              updateValue={setPassword}
              errorText={passwordError}
            ></InputField>
            <div
              className="absolute right-[14px] bottom-[5px] cursor-pointer"
              onClick={showPasswordHandler}
            >
              {!showPassword && (
                <Image
                  src="/assets/eye-slash.svg"
                  alt="eye slash"
                  width="24px"
                  height="24px"
                />
              )}
              {showPassword && (
                <Image
                  src="/assets/eye.svg"
                  alt="eye"
                  width="24px"
                  height="24px"
                />
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-[8px] my-[24px] 1bp:gap-[14px] items-center">
              <input
                className="b-[#0D1011] b-[0.5px] w-[16px] h-[16px] 1bp:w-[20px] 1bp:h-[20px]"
                type="checkbox"
                id="checkbox"
              ></input>
              <p className="font-[Poppins] font-normal text-[12px] leading-[18px] text-[#0D1011] 1bp:text-[16px]">
                Remember my information
              </p>
            </div>
            <span onClick={forgotPassword}>
              <p className="font-Poppins font-normal text-[12px] leading-[18px] text-[#061A40] cursor-pointer 1bp:text-[16px]">
                Forgot your password?
              </p>
            </span>
          </div>

          <button
            onClick={submitAccount}
            className="w-[100%] h-[47px] bg-[#061A40] font-semibold font-[Poppins] text-[#F2F4F5] text-[12px] leading-[18px] text-center rounded-[8px] shadow-md transition-all hover:scale-105 hover:shadow-lg 1bp:text-[16px]"
          >
            Log in
          </button>
        </div>
      </div>
      {emailNotVerified ? (
        <>
          <div className="fixed z-10 flex items-center justify-center w-full h-full shadow-black backdrop-blur-sm backdrop-brightness-90">
            <EmailVerification
              code={setOtpCode}
              email={email}
              otpNotMatchError={otpError}
              setOtpNotMatchError={setOtpError}
            />
          </div>
        </>
      ) : null}
      {resetPassword ? (
        <>
          <div className="fixed z-10 flex items-center justify-center w-full h-full shadow-black backdrop-blur-sm backdrop-brightness-90">
            <ResetPassword
              // @ts-ignore
              email={email}
              setResetPassword={setResetPassword}
              expiredError={expiredError}
            />
          </div>
        </>
      ) : null}
    </main>
  )
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get('user')

    if (!user) {
      return { props: {} }
    }

    return {
      props: { user },
    }
  },
  {
    cookieName: 'Connective',
    cookieOptions: {
      secure: process.env.NODE_ENV == 'production' ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  },
)
