import InputField from '../input-field'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import FileUpload from '../file-upload'
import Select from 'react-select'
import Util from '../../util'
import * as Routes from '../../util/routes'
import {
  IApiResponseError,
  ProfileApiResponse,
} from '../../types/apiResponseTypes'
import { Industry, User } from '../../types/types'

type Props = {
  user: User
  industries: Industry[]
}

export default function EditProfile({ user, industries }: Props) {
  const [name, setName] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [nameError, setNameError] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [pfp, setPfp] = useState<Blob>()
  const [src, setSrc] = useState<string>('')
  const [industry, setIndustry] = useState<number>()
  const [industryName, setIndustryName] = useState<string>('')
  const [industryError, setIndustryError] = useState<string>('')
  const [size, setSize] = useState<string>('')
  const [sizeError, setSizeError] = useState<string>('')
  const [loaded, setLoaded] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const [pfpChanged, setPfpChanged] = useState<boolean>(false)
  const [status, setStatus] = useState<string>('')
  const [isSubscribed, setSubscribed] = useState<boolean>(false)
  const [curruntStatus, setCurruntStatus] = useState<string>('')

  useEffect(() => {
    setLoaded(false)
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      await axios.get('/api/profiles/business').then((res) => {
        let data: ProfileApiResponse.IBusiness | IApiResponseError = res.data
        if (data.type == 'IApiResponseError') {
          throw data
        } else {
          let business = data.business
          setUserId(business.user_id.toString())
          setName(business.company_name)
          setDescription(business.description)
          setLocation(business.location)
          setUrl(business.website)
          setSize(business.size)
          setSrc(business.logo)
          setStatus(business.status)
          setCurruntStatus(business.status)
          setSubscribed(business.is_subscribed)
          const selectedIndustry = industries.find(
            (industry) => industry.id == business.industry,
          )
          setIndustry(selectedIndustry.id)
          setIndustryName(selectedIndustry.name)
          setLoaded(true)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const statusOptions = [
    {
      value: 'Looking to give client for commission.',
      label: 'Looking to give client for commission.',
    },
    {
      value: 'Looking to get client for a commission.',
      label: 'Looking to get client for a commission.',
    },
    {
      value: 'Looking to expand my network',
      label: 'Looking to expand my network',
    },
  ]

  const sizeOptions = [
    { value: '1-10', label: '1-10' },
    { value: '10-50', label: '10-50' },
    { value: '50-100', label: '50-100' },
    { value: '100-200', label: '100-200' },
    { value: '200-1000', label: '200-1000' },
    { value: '1000+', label: '1000+' },
  ]

  const router = useRouter()

  useEffect(() => {
    console.log(pfp)
    if (pfp == undefined || pfp == null || typeof pfp == 'undefined') return
    setPfpChanged(true)
    setSrc(URL.createObjectURL(pfp))
  }, [pfp])

  const handleChangeIndustry = (value: number) => {
    const selectedIndustry = industries.find((industry) => industry.id == value)
    setIndustryName(selectedIndustry.name)
    setIndustry(selectedIndustry.id)
  }

  const submit = async () => {
    if (processing) return
    setProcessing(true)

    if (name == '') {
      setNameError('You must enter a name.')
      setIndustryError('')
      setSizeError('')
      return
    }
    if (size == '') {
      setSizeError('You must select your company size.')
      setIndustryError('')
      setNameError('')
      return
    }
    if (industry == null) {
      setIndustryError('You must select your company size.')
      setSizeError('')
      setNameError('')
      return
    }

    setNameError('')
    setSizeError('')
    setIndustryError('')

    let hasPfp = false
    if (pfp != null && pfp != undefined && typeof pfp != 'undefined') {
      hasPfp = true
    }

    let uploadUrl = ''
    if (hasPfp) {
      uploadUrl = await Util.uploadFile(user.id + '-pfp', pfp)
    }

    await axios
      .put('/api/profiles/business', {
        pfp: hasPfp ? uploadUrl : '',
        pfpChanged,
        name,
        description,
        location,
        url,
        industry,
        size,
        status,
        isSubscribed,
      })
      .then(async (res) => {
        if (res.status == 200) {
          console.log('success')
          if (status !== curruntStatus) {
            await axios.post('/api/notifications/sendEmailOnStatusChange', {
              userId,
              status,
              profile: 'Business',
            })
          }
          router.push(`${Routes.PROFILE}/${userId}`)
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

  const changeSubscription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscribed(e.target.checked)
  }

  return loaded ? (
    <main className="flex flex-row min-h-screen min-w-screen">
      <div className="flex flex-col w-[40vw] mx-auto font-[Montserrat] bg-[#F9F9F9] rounded-xl shadow-md p-5 my-20">
        <div className="flex flex-row gap-10 mb-10">
          <p className="text-3xl font-bold">Edit Profile</p>
        </div>

        <div className="flex flex-col gap-5 mt-0">
          <InputField
            name={'Name*'}
            placeholder={'Enter company name'}
            updateValue={setName}
            errorText={nameError}
            value={name}
          ></InputField>
          <InputField
            name={'Description'}
            placeholder={'Enter company description'}
            updateValue={setDescription}
            textarea={true}
            value={description}
          ></InputField>
          <div>
            <p className="text-sm mb-2">Logo</p>
            <FileUpload
              text="Upload company logo"
              file={pfp}
              setFile={setPfp}
              id={'Company pfp upload'}
              src={src}
              user={name}
              profilePicture={true}
              editProfile={true}
            ></FileUpload>
          </div>
          <InputField
            name={'Website'}
            placeholder={'Enter company website URL'}
            updateValue={setUrl}
            value={url}
          ></InputField>
          <InputField
            name={'Location'}
            placeholder={'Enter where your company is located'}
            updateValue={setLocation}
            value={location}
          ></InputField>
          <div className="flex flex-row justify-between gap-10">
            <div className="w-full">
              <p className="text-sm mb-2">Industry*</p>
              <Select
                className="w-full"
                onChange={(e) => {
                  handleChangeIndustry(Number(e.value))
                }}
                options={industries as any}
                placeholder="Choose your industry"
                value={{ value: industryName, label: industryName }}
              ></Select>
              <p className="text-red-500 font-bold text-[12px]">
                {industryError}
              </p>
            </div>
            <div className="w-full">
              <p className="text-sm mb-2">Size*</p>
              <Select
                className="w-full"
                onChange={(e) => {
                  setSize(e.value)
                }}
                options={sizeOptions}
                placeholder="Choose your company size"
                value={{ value: size, label: size }}
              ></Select>
              <p className="text-red-500 font-bold text-[12px]">{sizeError}</p>
            </div>
            <div className="w-full">
              <p className="text-sm mb-2">Status*</p>
              <Select
                className="w-full text-[12px] font-[Poppins]"
                onChange={(e) => {
                  setStatus(e.value)
                }}
                options={statusOptions}
                placeholder="Choose your Status"
                value={{ value: status, label: status }}
              ></Select>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <input
              className="b-[#0D1011] b-[0.5px] w-[16px] h-[16px] 1bp:w-[20px] 1bp:h-[20px]"
              type="checkbox"
              checked={isSubscribed}
              onChange={changeSubscription}
            ></input>
            <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] 1bp:text-[16.5px]">
              Subscribe to newsletter
            </p>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={processing}
          className={`w-full  font-bold text-white py-4 mt-20 rounded-md shadow-md transition-all ${
            !processing
              ? 'hover:scale-105 hover:shadow-lg bg-[#0F172A]'
              : 'bg-[#0F172A]/70'
          }`}
        >
          Save Profile
        </button>
      </div>
    </main>
  ) : (
    <>Loading...</>
  )
}
