import React, { useState, useEffect } from 'react'
import Switch from 'react-switch'
import { withIronSession } from 'next-iron-session'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import axios from 'axios'
import InputField from 'components/input-field'
import LoginSidebar from 'components/login-sidebar'
import SigninModal from 'components/auth/signinModal'
import AuthButton from 'components/button/AuthButton'
import GoogleSsoDivider from 'components/divider/orDivider'
import EmailVerification from 'components/dailog/EmailVerification'
import { AuthApiResponse, IApiResponseError } from 'types/apiResponseTypes'
import * as Routes from 'util/routes'
// import ResetPassword from './resetpassword/[email]/[token]'

export default function SignIn() {
  const router = useRouter()
  const { error } = router.query
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [resetPassword, setResetPassword] = useState<boolean>(false)
  const [emailNotVerified, setEmailNotVerified] = useState<boolean>(false)
  const [otpCode, setOtpCode] = useState<string>('')
  const [checked, setChecked] = useState<boolean>(false)
  const [otpError, setOtpError] = useState<string>('')
  const [expiredError, setExpiredError] = useState<boolean>(false)
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false)

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

  const forgotPassword = async (email?) => {
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

  return (
    <main className="flex flex-row-reverse justify-center h-[100vh] bg-[#FCF7FF]">
      <Head>
        <title>Signin - Connective</title>
      </Head>
      <LoginSidebar />

      <div className="w-100 flex overflow-hidden h-[100vh]">
        <div className="w-100 overflow-x-hidden flex overflow-y-scroll">
          <div className="w-3/4 mx-auto">
            <div className="flex flex-col max-w-[704px] w-[100%] font-[Montserrat] my-[32px]">
              <div className="flex justify-between items-center mb-5">
                <div className="cursor-pointer">
                  <Link href="https://www.connective-app.xyz" passHref>
                    <a>
                      <Image
                        src="/assets/logo.svg"
                        alt="Connective logo"
                        width="173px"
                        height="41px"
                      />
                    </a>
                  </Link>
                </div>
                <p className="font-[Poppins] font-normal text-[14px] leading-[36px] text-center text-[#414141] 1bp:text-[16px]">
                  Don't have an account?{' '}
                  <Link href="/auth/signup">
                    <span className="text-purple cursor-pointer">Sign up!</span>
                  </Link>
                </p>
              </div>
              <div className="mt-5 flex flex-col items-center">
                <div className="text-center">
                  <p className="font-semibold text-[44px] leading-[39px] text-[#0D1011]">
                    Welcome Back!
                  </p>
                  <p className="text-[#414141] my-[12px] font-normal text-[16px] leading-[37px] font-[Poppins] 1bp:text-[18px] mb-10">
                    Login into your account
                  </p>
                </div>
                <AuthButton isSignUp={false} type="google" />
                <div className="w-3/5 4bp:w-full">
                  <GoogleSsoDivider />
                  <div className="relative flex flex-col gap-5 mt-10 items-center">
                    <InputField
                      name={'Email'}
                      placeholder={'Enter your email'}
                      updateValue={setEmail}
                      errorText={emailError}
                    />
                    <InputField
                      name={'Password'}
                      placeholder={'Enter password'}
                      updateValue={setPassword}
                      password
                      errorText={passwordError}
                    />
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-[8px] my-[24px] 1bp:gap-[14px] items-center">
                      <Switch
                        onChange={() => setChecked(!checked)}
                        checked={checked}
                        checkedIcon={false}
                        uncheckedIcon={false}
                        handleDiameter={15}
                        offColor="#eeecf6"
                        onColor="#eeecf6"
                        width={38}
                        height={20}
                      />
                      <p className="font-[Poppins] font-normal text-[12px] leading-[18px] text-[#0D1011] 1bp:text-[16px]">
                        Remember me
                      </p>
                    </div>
                    <span onClick={() => setShowForgotModal(true)}>
                      <p className="font-Poppins font-normal text-[12px] leading-[18px] text-[#D93F21] cursor-pointer 1bp:text-[16px]">
                        Recover Password
                      </p>
                    </span>
                  </div>
                  <button
                    onClick={submitAccount}
                    className="mb-5 w-[100%] h-[56px] bg-[#7E38B7] font-[Poppins] text-[#F2F4F5] text-[16px] leading-[18px] text-center rounded-full shadow-md transition-all hover:scale-105 hover:shadow-lg 1bp:text-[16px]"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
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
      <SigninModal
        isShow={showForgotModal}
        onClick={forgotPassword}
        onClose={() => setShowForgotModal(false)}
        emailSet={setEmail}
      />
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
