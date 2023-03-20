import axios from 'axios'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import Avatar from '../../avatar'
import * as Routes from '../../../util/routes'
import { Individual, User } from '../../../types/types'
import {
  IApiResponseError,
  ProfileApiResponse,
} from '../../../types/apiResponseTypes'

type Props = {
  user: User
  id: number
  setLoaded: Dispatch<SetStateAction<boolean>>
}

export default function IndividualProfile({ user, id, setLoaded }: Props) {
  const router = useRouter()

  const [data, setData] = useState<Individual>(null)

  useEffect(() => {
    setLoaded(false)
    getProfile()
  }, [])

  useEffect(() => {
    if (typeof window != 'undefined' && typeof user == 'undefined') {
      router.push(Routes.SIGNIN)
    }
  }, [user])

  const getProfile = async () => {
    await axios.get(`/api/profiles/individual?id=${id}`).then((res) => {
      let data: ProfileApiResponse.IIndividual | IApiResponseError = res.data
      if (data.type == 'IApiResponseError') throw data
      else {
        setData(data.individual)
        setLoaded(true)
      }
    })
  }

  return (
    <>
      <div className="w-[100%] flex flex-row justify-between items-center mt-[-70px]">
        <div className="mb-[64px] flex flex-row items-center gap-[40px] pl-[50px]">
          {data?.profile_picture == '' ? (
            <Avatar width="100px" height="100px" title={data?.name} />
          ) : (
            <div className="w-[200px] h-[200px]">
              <img
                className="rounded-full w-[100%] h-[100%] z-10 backdrop-blur-sm bg-white/20 shadow-md"
                src={data?.profile_picture}
              ></img>
            </div>
          )}

          <div className="flex flex-col mt-[80px]">
            <div className="flex flex-row">
              <p className="font-bold text-2xl 2xl:text-4xl mb-1 text-[#0D1011]">
                {data?.name}
              </p>
            </div>

            <div className="flex flex-row gap-10 text-[14px] 2xl:text-xl mr-16 pb-5 font-[Poppins]">
              <div className="flex flex-row gap-2  items-center">
                <img
                  className="h-[14px] w-[14px]"
                  src="/assets/location-pin.png"
                />
                <p>{data?.location}</p>
              </div>
            </div>
          </div>
        </div>

        {user.id == id && (
          <div
            className="flex flex-row gap-[12px] cursor-pointer text-white rounded-lg bg-[#061A40] items-center py-[18px] px-[40px]"
            onClick={() => router.push(Routes.EDITPROFILE)}
          >
            <img className="w-[20px] h-[20px]" src="/assets/edit.svg" />
            <p className="hover:scale-105 hover:shadow-lg font-[Poppins] text-center text-[14px]">
              Edit Profile
            </p>
          </div>
        )}
      </div>

      {data?.status ? (
        <div
          className="rounded py-3 px-6 w-fit"
          style={{
            backgroundColor:
              data?.status === 'Looking to give client for commission.'
                ? '#4b5e6d'
                : '#c2cfd8',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <p
            style={{
              color:
                data?.status === 'Looking to give client for commission.'
                  ? 'white'
                  : 'black',
            }}
          >{`Status: ${data?.status}`}</p>
        </div>
      ) : null}

      <div className="mb-[60px]">
        <p className="text-[18px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-4 1bp:text-[16.5px]">
          About
        </p>
        <div className="max-w-[540px] font-[Poppins] font-normal text-[16px] leading-[24px] text-[#0D1011]">
          <p>{data?.bio}</p>
        </div>

        <div></div>
      </div>

      {/* <div>
            <p className="text-[18px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-4 1bp:text-[16.5px]">
              Lists for Sale
            </p>
            <div className="flex flex-row flex-wrap gap-[32px] mb-[65px]">
              {typeof data.lists != "undefined" && data.lists.length > 0 && (
                <>
                  {data.lists.map((item, index) => {
                    return <ListCard item={item}></ListCard>;
                  })}
                </>
              )}
            </div>
          </div> */}
    </>
  )
}
