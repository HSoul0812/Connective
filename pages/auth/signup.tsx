import InputField from '../../components/input-field'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import OnboardingSidebar from '../../components/onboarding-sidebar'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import * as Routes from '../../util/routes'
import EmailVerification from '../../components/dailog/EmailVerification'
import GoogleSsoDivider from '../../components/divider/orDivider'
import AuthButton from '../../components/button/AuthButton'
import {
  AuthApiResponse,
  IApiResponseError,
} from '../../types/apiResponseTypes'

export default function SignUp() {
  const [name, setName] = useState<string>('')
  const [nameError, setNameError] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [otpError, setOtpError] = useState<string>('')
  const [tacError, setTacError] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSubscribed, setSubscribed] = useState<boolean>(false)
  const [otpCode, setOtpCode] = useState<string>('')
  const [emailVerified, setEmailVerified] = useState<boolean>(false)
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false)

  const router = useRouter()

  const verifyEmail = async () => {
    const verifiedEmail: AuthApiResponse.IVerifyEmail | IApiResponseError = (
      await axios({
        method: 'post',
        url: '/api/auth/verifyEmail',
        data: { code: otpCode, email },
      })
    ).data
    if (!verifiedEmail.success) {
      if (
        verifiedEmail.type == 'IApiResponseError' &&
        verifiedEmail.error === 'Incorrect verification code'
      )
        setOtpError('Incorrect verification code')
    } else {
      setEmailVerified(true)
    }
  }

  useEffect(() => {
    if (otpCode && signUpSuccess) {
      verifyEmail()
    }
  }, [otpCode, signUpSuccess])

  const signIn = async () => {
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
        if (
          e.response.status == 403 ||
          e.response.data.error == 'Account does not exist'
        )
          setPasswordError('Incorrect email or password')
      })
  }

  useEffect(() => {
    if (emailVerified) {
      signIn()
    }
  }, [emailVerified])

  const submitAccount = async () => {
    // @ts-ignore
    let checkboxChecked = document.getElementById('checkbox').checked

    if (name == '') {
      setNameError('You must enter a name.')
      setEmailError('')
      setPasswordError('')
      setTacError('')
      return
    }
    if (email == '') {
      setEmailError('You must enter an email.')
      setNameError('')
      setPasswordError('')
      setTacError('')
      return
    }
    if (password == '') {
      setPasswordError('You must enter a password.')
      setNameError('')
      setEmailError('')
      setTacError('')
      return
    }
    if (!checkboxChecked) {
      setTacError('You must accept the terms and conditions')
      setPasswordError('')
      setNameError('')
      setEmailError('')
      return
    }

    setNameError('')
    setPasswordError('')
    setEmailError('')

    await axios({
      method: 'post',
      url: '/api/auth/signup',
      data: {
        username: name,
        email,
        password,
        is_subscribed: isSubscribed,
      },
    })
      .then(async (res) => {
        const randomOtp = Math.floor(1000 + Math.random() * 9000)
        await axios({
          method: 'post',
          url: '/api/auth/sendVerificationCode',
          data: { code: randomOtp, email },
        })
          .then(async (data) => {
            if (data) setSignUpSuccess(true)
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((e) => {
        if (e.response.data.error == 'Email already exists') {
          setEmailError('Email already exists.')
        } else {
          console.log(e)
        }
      })
  }

  const showPasswordHandler = () => {
    setShowPassword((prevState) => !prevState)
  }

  const changeSubscription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscribed(e.target.checked)
  }

  return (
    <main className="flex flex-row min-h-screen min-w-screen gap-[90px] justify-center 2bp:gap-[50px]">
      <Head>
        <title>Signup - Conenctive</title>
      </Head>
      <OnboardingSidebar></OnboardingSidebar>
      <div className="flex flex-col max-w-[704px] w-[100%] font-[Montserrat] my-[92px] mr-[32px]">
        <div>
          <p className="font-bold text-[32px] leading-[39px] text-[#0D1011]">
            Sign up
          </p>
          <p className="text-[#414141] mt-[12px] font-normal text-[16px] leading-[24px] font-[Poppins]  1bp:text-[18px] mb-[40px]">
            Have an account?{' '}
            <Link href="./signin">
              <span className="font-bold cursor-pointer">Log In</span>
            </Link>
          </p>
        </div>
        <AuthButton isSignUp={true} type="google" />
        <GoogleSsoDivider />

        <div className="flex flex-col gap-5 mt-[28px]">
          <InputField
            name={'Name'}
            placeholder={'Enter your name'}
            updateValue={setName}
            errorText={nameError}
          />

          <InputField
            name={'Email'}
            placeholder={'Enter your email'}
            updateValue={setEmail}
            errorText={emailError}
          />

          <div className="relative flex flex-row items-center justify-center">
            <InputField
              name={'Password'}
              placeholder={'Enter password'}
              password={!showPassword ? true : false}
              updateValue={setPassword}
              errorText={passwordError}
            />
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
        </div>
        <div className="flex flex-row gap-[8px] mt-[24px] 1bp:gap-[14px] items-center">
          <input
            className="b-[#0D1011] b-[0.5px] w-[16px] h-[16px] 1bp:w-[20px] 1bp:h-[20px]"
            type="checkbox"
            checked={isSubscribed}
            onChange={changeSubscription}
          ></input>
          <p className="font-[Poppins] font-normal text-[12px] leading-[18px] text-[#0D1011] 1bp:text-[16px]">
            Subscribe me to newsletter
          </p>
        </div>
        <div className="flex flex-row gap-[8px] my-[24px] 1bp:gap-[14px] items-center">
          <input
            className="b-[#0D1011] b-[0.5px] w-[16px] h-[16px] 1bp:w-[20px] 1bp:h-[20px]"
            type="checkbox"
            id="checkbox"
          ></input>
          <p className="font-[Poppins] font-normal text-[12px] leading-[18px] text-[#0D1011] 1bp:text-[16px]">
            I accept the{' '}
            <span className="underline cursor-pointer">
              Terms and Conditions
            </span>{' '}
            and I have read the{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
        <p className="text-red-500 font-bold text-[12px]">{tacError}</p>
        <button
          onClick={submitAccount}
          className="w-[229px] h-[47px] bg-[#061A40] font-semibold font-[Poppins] text-[#F2F4F5] text-[12px] leading-[18px] text-center rounded-[8px] shadow-md transition-all hover:scale-105 hover:shadow-lg 1bp:text-[16px]"
        >
          Sign up
        </button>
      </div>
      {signUpSuccess ? (
        <>
          <div className="w-full fixed h-full shadow-black z-10 backdrop-blur-sm flex items-center backdrop-brightness-90">
            <EmailVerification
              code={setOtpCode}
              email={email}
              otpNotMatchError={otpError}
              setOtpNotMatchError={setOtpError}
            />
          </div>
        </>
      ) : null}
    </main>
  )
}
