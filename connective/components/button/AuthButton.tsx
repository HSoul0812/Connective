import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import googleIcon from '../../public/assets/google-icon.svg'
import facebookIcon from '../../public/assets/facebook-icon.svg'
import { AuthApiResponse } from '../../types/apiResponseTypes'
import * as Routes from '../../util/routes'

type Props = {
  type: string
  isSignUp: boolean
}

const AuthButton = ({ isSignUp = false, type }: Props) => {
  const router = useRouter()
  const isGoogle = type === 'google'
  const { token, email } = router.query
  const [isWorking, setIsWorking] = useState<boolean>(false)

  const googleSignIn = (accessToken: string, email: string) => {
    setIsWorking(true)

    axios({
      method: 'post',
      url: '/api/auth/sessions',
      data: { email, accessToken, type: 'google' },
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
        console.log(e)
      })
      .finally(() => {
        setIsWorking(false)
      })
  }

  useEffect(() => {
    if (token && email) {
      googleSignIn(token.toString(), email.toString())
    }
  }, [token, email])

  return (
    <div>
      <div className="flex justify-center">
        <button
          disabled={isWorking}
          onClick={() => signIn(type)}
          className="flex justify-center items-center w-fit border-2 border-solid border-purple bg-slate-50 font-[Poppins] px-[28px] py-[10px] text-black text-[13px] leading-[18px] text-center rounded-full transition-all hover:scale-105 hover:shadow-lg disabled:bg-slate-200 disabled:hover:bg-slate-200 disabled:hover:scale-100 disabled:hover:shadow-none 1bp:text-[16px]"
        >
          <Image
            src={isGoogle ? googleIcon : facebookIcon}
            alt="Connective logo"
            width="24px"
            height="24px"
            style={{ marginRight: '3px', border: '1px solid black' }}
          />
          <span className="ml-2 font-[500]">
            {isSignUp
              ? isWorking
                ? 'Signing up...'
                : `${isGoogle ? 'Google' : 'Facebook'}`
              : isWorking
              ? 'Signing in...'
              : `${isGoogle ? 'Google' : 'Facebook'}`}
          </span>
        </button>
      </div>
    </div>
  )
}

export default AuthButton
