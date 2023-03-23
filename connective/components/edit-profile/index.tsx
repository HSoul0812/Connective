import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'

import InputField from 'components/input-field'
import FileUpload from 'components/file-upload/profile'
import { SelectField } from 'components/select-field/selectField'
import * as Routes from 'util/routes'
import { statusOptions } from 'util/validation/onboarding'
import * as Router from 'util/routes'
import {
  business as ValidateBusiness,
  individual as ValidateIndividual,
} from 'util/validation/onboarding'
import { User, IValidationItem, ValidationResponse } from 'types/types'

type Props = {
  data: any
  isBusiness: boolean
  user: User
  industries: any
}
const EditProfile = ({ data, isBusiness, user, industries }: Props) => {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<any>()
  const [showUpload, setShowUpload] = useState<boolean>(false)
  const [occupations, setOccupations] = useState<
    Array<{ value: number; label: string }>
  >([])
  const [processing, setProcessing] = useState<boolean>(false)
  const [fieldErrors, setFieldErrors] = useState<ValidationResponse>(null)

  useEffect(() => {
    const name = isBusiness ? data?.company_name : data?.name
    const description = isBusiness ? data?.description : data?.bio
    const logo = isBusiness ? data?.logo : data?.profile_picture
    setUserInfo({ ...data, name, description, logo })
  }, [data])

  useEffect(() => {
    setOccupations(
      industries
        .filter((_industry) => _industry.id == data.industry)[0]
        .occupations.map((occupation) => {
          return { value: occupation.id, label: occupation.name }
        }),
    )
  }, [data])

  const submit = async () => {
    if (processing) return
    setProcessing(true)

    let res = isBusiness
      ? ValidateBusiness(
          userInfo.name,
          userInfo.size,
          userInfo.industry,
          userInfo.occupation,
          userInfo.description,
          userInfo.status,
        )
      : ValidateIndividual(
          userInfo.name,
          userInfo.description,
          userInfo.industry,
          userInfo.occupation,
          userInfo.status,
        )
    if (!res.success) {
      setFieldErrors(res)
      setProcessing(false)
      return
    }
    let payload = {
      pfp: userInfo.logo,
      name: userInfo.name,
      location: userInfo.location,
      status: userInfo.status,
      industry: userInfo.industry,
      occupation: userInfo.occupation,
      isSubscribed: userInfo.is_subscribed,
    }

    const url = isBusiness
      ? '/api/profiles/business'
      : '/api/profiles/individual'
    await axios
      .put(
        url,
        isBusiness
          ? {
              ...payload,
              pfpChanged: true,
              description: userInfo.description,
              url: userInfo.website,

              size: userInfo.size,
            }
          : {
              ...payload,
              bio: userInfo.description,
            },
      )
      .then((res) => {
        if (res.status == 200) {
          console.log('success')
          router.push(`${Routes.PROFILE}/${user.id}`)
        }
      })
      .catch((e) => {
        if (
          e.response.status == 403 ||
          e.response.data.error == 'Account does not exist'
        ) {
        }
      })

    setProcessing(false)
  }

  return (
    <div className="w-full h-[100vh]">
      <div className="relative w-full h-[25%] flex bg-[url('/assets/profile/bg-edit.svg')] bg-no-repeat bg-center bg-cover">
        <div className="absolute top-0 flex justify-between w-full h-fit px-5 py-4">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex flex-row cursor-pointer items-center">
                <Image
                  src="/assets/profile/logo.svg"
                  width={28}
                  height={31}
                  priority
                />
                <div className="ml-2 flex items-center">
                  <Image
                    src="/assets/profile/logoText.svg"
                    width={131}
                    height={25}
                    priority
                  />
                </div>
              </div>
            </Link>
            <div className="text-white mx-4">/</div>
            <div className="flex items-end">
              <p className="text-white text-[24px] leading-[26px] font-[600]">
                Edit Profile
              </p>
              <p className="text-white text-[14px] leading-[21px] font-[400] ml-3">
                Individual Profile
              </p>
            </div>
          </div>
          <div
            className="text-white flex items-center cursor-pointer"
            onClick={() => router.push(Router.DASHBOARD)}
          >
            <Image src="/assets/profile/home.svg" height={14} width={14} />
            <p>Go to Dashboard</p>
          </div>
        </div>
        <div className="m-auto flex items-center gap-2">
          {!!userInfo?.logo && (
            <Image
              src={`${userInfo?.logo}`}
              height={60}
              width={60}
              className="rounded-full"
              loading="eager"
              priority
            />
          )}

          <div className="flex flex-col text-white gap-2">
            <div className="text-[22px]">{userInfo?.name}</div>
            <div className="text-[16px]">{user?.email}</div>
          </div>
        </div>
      </div>
      <div className="py-5 px-20 flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="w-5/12">
            <InputField
              name={'Name'}
              placeholder={`Enter your ${
                isBusiness ? 'company name' : 'name'
              } here`}
              updateValue={(value) => setUserInfo({ ...userInfo, name: value })}
              value={userInfo?.name || ''}
            />
          </div>
          <div className="w-5/12">
            <InputField
              name={'Email Address'}
              updateValue={() => {}}
              value={user?.email || ''}
              disabled={true}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-5/12">
            <InputField
              name={isBusiness ? 'Company Bio' : 'Bio'}
              placeholder={`Enter your ${
                isBusiness ? 'company bio' : 'bio'
              } here...`}
              textarea
              isFull
              updateValue={(value) =>
                setUserInfo({ ...userInfo, description: value })
              }
              value={userInfo?.description || ''}
            />
          </div>
          <div className="relative w-5/12">
            <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-3 1bp:text-[16.5px]">
              {isBusiness ? 'Company Logo' : 'Logo'}
            </p>
            <div
              className="border border-dotted border-gray w-full flex flex-col items-center justify-center gap-2 py-4 cursor-pointer"
              onClick={() => setShowUpload(true)}
            >
              {userInfo?.logo ? (
                <>
                  <Image
                    src={userInfo?.logo}
                    height={74}
                    width={74}
                    className="rounded-full"
                  />
                  <div className="text-purple text-sm text-center">
                    Change Profile Photo
                  </div>
                </>
              ) : (
                <>
                  <Image src="/assets/cloud.svg" width={44} height={35} />
                  <div className="text-purple text-[14px] listing-[24px] mt-3">
                    Upload {isBusiness ? 'company logo' : 'Profile Picture'}{' '}
                    here
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-10">
          <InputField
            name={'Website'}
            placeholder={'Enter company website URL'}
            updateValue={(value) =>
              setUserInfo({ ...userInfo, website: value })
            }
            value={userInfo?.website || ''}
          />
          <InputField
            name={'Location'}
            placeholder={'Enter where your company is located'}
            updateValue={(value) =>
              setUserInfo({ ...userInfo, location: value })
            }
            value={userInfo?.location || ''}
          />
          <SelectField
            title="Industry"
            placeholder="Choose your industry"
            options={industries.map((industry) => ({
              value: industry.id,
              label: industry.name,
            }))}
            onChange={(e) => {
              setUserInfo({ ...userInfo, industry: e.value })
            }}
            value={userInfo?.industry}
            errorText={
              fieldErrors
                ? fieldErrors.fields.filter(
                    (field: IValidationItem) => field.name == 'industry',
                  )[0]?.error
                : ''
            }
          />
          <SelectField
            title="Occupation"
            placeholder="Choose your occupation"
            options={occupations}
            onChange={(e) => {
              setUserInfo({ ...userInfo, occupation: e.value })
            }}
            value={userInfo?.occupation}
            errorText={
              fieldErrors
                ? fieldErrors.fields.filter(
                    (field: IValidationItem) => field.name == 'occupation',
                  )[0]?.error
                : ''
            }
          />
        </div>
        <div className="w-1/4 pr-5">
          <SelectField
            title="Status"
            placeholder="Choose your status"
            options={statusOptions}
            onChange={(e) => {
              setUserInfo({ ...userInfo, status: e.value })
            }}
            value={userInfo?.status}
            errorText={
              fieldErrors
                ? fieldErrors.fields.filter(
                    (field: IValidationItem) => field.name == 'status',
                  )[0]?.error
                : ''
            }
          />
        </div>
        <button
          className="bg-purple text-white text-[16px] font-[500] py-2 w-1/4 rounded-full"
          onClick={submit}
          disabled={processing}
        >
          Save Changes
        </button>
      </div>
      <FileUpload
        show={showUpload}
        onClose={() => setShowUpload(false)}
        onSubmit={(value) => {
          setUserInfo({ ...userInfo, logo: value })
          setShowUpload(false)
        }}
        data={userInfo}
      />
    </div>
  )
}

export default EditProfile
