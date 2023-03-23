import { useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Recache } from 'recache-client'
import { withIronSession } from 'next-iron-session'
import { toInteger } from 'lodash'

import Layout from 'components/layout'
import ProfileComponent from 'components/profile'
import * as Routes from 'util/routes'
import Util from 'util/index'
import { DAO } from 'lib/dao'

export default function Profile({ user, industries }) {
  const router = useRouter()
  const { id } = router.query
  const [loaded, setLoaded] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [accountType, setAccountType] = useState<boolean>()
  const [industry, setIndustry] = useState<string>('')
  const [occupation, setOccupation] = useState<string>('')

  useEffect(() => {
    try {
      Recache.logEvent_AutodetectIp('profile')
    } catch (e) {
      console.log(e)
    }
  }, [])

  const getProfile = async () => {
    const type = await Util.accountType(Number(id.toString()))
    setAccountType(type)
    const url = type ? '/api/profiles/business' : '/api/profiles/individual'
    try {
      await axios.get(`${url}?id=${id}`).then((res) => {
        let data = res.data
        if (data.type == 'IApiResponseError') {
          throw data
        } else {
          const result = type ? data.business : data.individual
          setData(result)
          setLoaded(true)
          const selectedIndustry = industries.find(
            (industry) => industry.id == result.industry,
          )

          const selectedOccupation = selectedIndustry?.occupations.find(
            (item) => item.id == toInteger(result.occupation),
          )

          setOccupation(selectedOccupation.name)
          setIndustry(selectedIndustry.name)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (typeof user == 'undefined') router.push(Routes.SIGNIN)
    getProfile()
  }, [user])

  return (
    <Layout
      user={{
        ...data,
        name: accountType ? data?.company_name : data?.name,
        logo: accountType ? data?.logo : data?.profile_picture,
      }}
      title="Profile/About"
    >
      <main className="flex flex-row h-screen min-w-screen font-[Montserrat] bg-[#F5F5F5]">
        <Head>
          <title>Profile - Connective</title>
        </Head>
        <div className="w-screen mr-5">
          <div
            className={`${loaded ? 'flex' : 'hidden'} flex-col w-[100%] h-full`}
          >
            {accountType !== undefined && (
              <ProfileComponent
                data={data}
                user={user}
                industry={industry}
                occupation={occupation}
                isBusiness={accountType}
                getProfile={getProfile}
              />
            )}
          </div>
          <div className={loaded ? 'hidden' : 'block'}>
            <p className="text-center">Loading...</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get('user')
    if (!user) {
      return { props: {} }
    }

    const industries = await DAO.Industries.getAll()
    return {
      props: { user, industries },
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
