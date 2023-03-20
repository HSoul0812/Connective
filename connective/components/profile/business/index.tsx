import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'
import * as Routes from 'util/routes'
import Avatar from 'components/avatar'
import { User, Industry } from 'types/types'
import { IApiResponseError, ProfileApiResponse } from 'types/apiResponseTypes'

type Props = {
  user: User
  industries: Industry[]
  id: number
  setLoaded: Dispatch<SetStateAction<boolean>>
}

export default function BusinessProfile({
  user,
  industries,
  id,
  setLoaded,
}: Props) {
  const router = useRouter()

  const [data, setData] = useState<any>(null)
  const [industry, setIndustry] = useState<string>('')

  useEffect(() => {
    getProfile()
  }, [])

  useEffect(() => {
    if (typeof window != 'undefined' && typeof user == 'undefined') {
      router.push(Routes.SIGNIN)
    }
  }, [user])

  const getProfile = async () => {
    try {
      await axios.get(`/api/profiles/business?id=${id}`).then((res) => {
        let data: ProfileApiResponse.IBusiness | IApiResponseError = res.data
        if (data.type == 'IApiResponseError') {
          throw data
        } else {
          setData(data.business)
          setLoaded(true)
          const selectedIndustry = industries.find(
            (industry) =>
              industry.id ==
              (data as ProfileApiResponse.IBusiness).business.industry,
          )
          setIndustry(selectedIndustry.name)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className="w-[100%] flex flex-row justify-between items-center">
        <div className="relative flex flex-row items-center gap-[40px] pl-[50px]">
          {data?.logo == '' ? (
            <Avatar width={140} height={140} title={data?.company_name} />
          ) : (
            <div
              className="w-[140px] h-[140px] border-4 border-white absolute top-0 -translate-y-1/2 rounded-full after:absolute after:right-[-10px] after:bottom-[14px] after:w-[40px] after:h-[40px] after:bg-[url('/assets/profile/edit.svg')] after:bg-[leng:24px_24px] after:bg-no-repeat after:bg-center  after:z-50 after:bg-white after:rounded-full after:cursor-pointer"
              onClick={() => console.log('asdf')}
            >
              {data?.logo && (
                <Image
                  className="rounded-full z-10 backdrop-blur-sm bg-white/20 shadow-md object-cover"
                  height="140"
                  width="140"
                  src={data.logo}
                />
              )}
            </div>
          )}

          <div className="flex flex-col mt-[80px]">
            <div className="flex flex-row">
              <p className="font-bold text-2xl 2xl:text-4xl mb-1 text-[#0D1011]">
                {data?.company_name}
              </p>
            </div>

            <div className="flex flex-row gap-10 text-[14px] 2xl:text-xl mr-16 pb-5 font-[Poppins]">
              <div className="flex flex-row gap-2 items-center">
                <img
                  className="h-[14px] w-[14px]"
                  src="/assets/location-pin.png"
                />
                <p>{data?.location}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <img className="h-[14px] w-[14px]" src="/assets/link.png" />
                <a
                  className="font-normal cursor-pointer text-[#061A40] underline-offset-0 font-[Poppins]"
                  href={
                    data?.website.includes('https')
                      ? data?.website
                      : 'https://' + data?.website
                  }
                >
                  Visit Website
                </a>
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
              data.status === 'Looking to give client for commission.'
                ? '#4b5e6d'
                : '#c2cfd8',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <p
            style={{
              color:
                data.status === 'Looking to give client for commission.'
                  ? 'white'
                  : 'black',
            }}
          >{`Status: ${data.status}`}</p>
        </div>
      ) : null}
      <div className="mb-[60px]">
        <p className="text-[18px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-4 1bp:text-[16.5px]">
          About
        </p>
        <div className="max-w-[540px] font-[Poppins] font-normal text-[16px] leading-[24px] text-[#0D1011]">
          <p>{data?.description}</p>
        </div>
      </div>
      <div className="flex flex-row gap-[35px] mb-[60px]">
        <div className="flex flex-row gap-[5px] items-center">
          <img
            className="w-[17px] h-[17px]"
            src="/assets/size.svg"
            alt="Size"
          />
          <p className="font-[Montserrat] text-[14px] text-[#061A40]">
            <span className="font-bold">Size:</span> {data?.size}
          </p>
        </div>
        <div className="flex flex-row gap-[5px] items-center">
          <img
            className="w-[17px] h-[17px]"
            src="/assets/industry.svg"
            alt="Industry"
          />
          <p className="font-[Montserrat] text-[14px] text-[#061A40]">
            <span className="font-bold">Industry:</span> {industry}
          </p>
        </div>
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
