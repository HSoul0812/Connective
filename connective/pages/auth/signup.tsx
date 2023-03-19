import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AuthService from 'services/authService'
import InputField from 'components/input-field'
import AuthButton from 'components/button/AuthButton'
import GoogleSsoDivider from 'components/divider/orDivider'
import OnboardingSidebar from 'components/onboarding/sidebar'
import EmailVerification from 'components/dailog/EmailVerification'
import { AuthApiResponse, IApiResponseError } from 'types/apiResponseTypes'
import { validateEmail } from 'util/validation/onboarding'
import * as Routes from 'util/routes'

const SignUp = () => {
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>('')
  const [otpCode, setOtpCode] = useState<string>('')
  const [otpError, setOtpError] = useState<string>('')
  const [tacError, setTacError] = useState<string>('')
  const [emailVerified, setEmailVerified] = useState<boolean>(false)
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false)

  const router = useRouter()

  const verifyEmail = async () => {
    const verifiedEmail:
      | AuthApiResponse.IVerifyEmail
      | IApiResponseError = await AuthService.verifyEmail({
      code: otpCode,
      email,
    })

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
    await AuthService.signin({ email, password })
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

    setEmailError('')
    setPasswordConfirmError('')
    setPasswordError('')
    setTacError('')

    if (email == '' || !validateEmail(email)) {
      setEmailError('Require valid email.')
      return
    }

    if (password == '') {
      setPasswordError('You must enter a password.')
      return
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError('Passwords must match')
      return
    }

    if (!checkboxChecked) {
      setTacError('You must accept the terms and conditions')
      return
    }
    const data = {
      username: name,
      email,
      password,
      is_subscribed: false,
    }
    await AuthService.signup(data)
      .then(
        async () =>
          await AuthService.sendVerifyCode(email)
            .then((data) => {
              if (data) setSignUpSuccess(true)
            })
            .catch((error) => {
              console.log(error)
            }),
      )
      .catch((e) => {
        if (e.response.data.error == 'Email already exists') {
          setEmailError('Email already exists.')
        } else {
          console.log(e)
        }
      })
  }

  return (
    <main className="flex flex-row min-h-screen min-w-screen">
      <Head>
        <title>Signup - Conenctive</title>
      </Head>
      <OnboardingSidebar isSignUp />
      <div className="w-100 flex overflow-hidden h-[100vh]">
        <div className="w-100 overflow-x-hidden flex overflow-y-scroll">
          <div className="my-auto relative min-h-screen">
            <p className="absolute top-[35px] right-[50px] text-[#414141] mt-[12px] font-normal text-[14px] leading-[36px] font-[Poppins] font-[400] 1bp:text-[18px] mb-[40px]">
              Have an account?{' '}
              <Link href="./signin">
                <span className="font-500 cursor-pointer text-purple">
                  Sign in
                </span>
              </Link>
            </p>
            <div className="flex flex-col font-[Montserrat] mt-[92px] py-[30px] px-[50px]">
              <div className="mt-[2vw]">
                <p className="font-bold text-center text-[44px] leading-[60px] text-black">
                  Getting started with Connective!
                </p>

                <p className="text-center text-[16px] leading-[37px] text-black mt-2 mb-4">
                  Sign up with your account
                </p>
              </div>
              <AuthButton isSignUp={true} type="google" />
              <div className="mx-auto">
                <GoogleSsoDivider />
                <div className="flex flex-col gap-4 mt-[28px]">
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
                      updateValue={setPassword}
                      errorText={passwordError}
                      password
                    />
                  </div>
                  <div className="relative flex flex-row items-center justify-center">
                    <InputField
                      name={'Confirm Password'}
                      placeholder={'Enter password'}
                      updateValue={setPasswordConfirm}
                      errorText={passwordConfirmError}
                      password
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-[8px] my-[24px] 1bp:gap-[14px] items-center">
                  <input
                    className="b-[#0D1011] b-[0.5px] w-[16px] h-[16px] 1bp:w-[20px] 1bp:h-[20px]"
                    type="checkbox"
                    id="checkbox"
                  ></input>
                  <p className="font-[Poppins] font-normal text-[12px] leading-[18px] text-[#0D1011] 1bp:text-[16px]">
                    I accept the{' '}
                    <span className="underline cursor-pointer text-purple">
                      Terms and Conditions
                    </span>{' '}
                    and I have read the{' '}
                    <span className="underline cursor-pointer text-purple">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                <p className="text-red-500 font-bold text-[12px]">{tacError}</p>
                <button
                  onClick={submitAccount}
                  className="h-[47px] bg-purple font-[500] font-[Poppins] mt-5 text-[#F2F4F5] text-[16px] leading-[18px] text-center rounded-full shadow-md transition-all hover:scale-105 hover:shadow-lg 1bp:text-[16px]"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default SignUp
