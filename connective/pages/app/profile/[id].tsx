import { useState, useEffect } from 'react'
import { withIronSession } from 'next-iron-session'
import Sidebar from '../../../components/sidebar'
import BusinessProfile from '../../../components/profile/business'
import IndividualProfile from '../../../components/profile/individual'
import Util from '../../../util'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Recache } from 'recache-client'
import * as Routes from '../../../util/routes'
import { DAO } from '../../../lib/dao'

export default function Profile({ user, industries }) {
  const [accountType, setAccountType] = useState<string>()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    try {
      Recache.logEvent_AutodetectIp('profile')
    } catch (e) {
      console.log(e)
    }
  }, [])

  const getAccountType = async () => {
    setAccountType(await Util.accountType(Number(id.toString())))
  }

  useEffect(() => {
    if (typeof user == 'undefined') router.push(Routes.SIGNIN)
    getAccountType()
  }, [user])

  return (
    <main className="flex flex-row h-screen min-w-screen font-[Montserrat] bg-[#F5F5F5]">
      <Head>
        <title>Profile - Conenctive</title>
      </Head>
      <Sidebar user={user}></Sidebar>
      <div className="h-screen w-screen overflow-y-scroll">
        {accountType == 'Business' && (
          <BusinessProfile
            user={user}
            industries={industries}
            id={Number(id.toString())}
          ></BusinessProfile>
        )}
        {accountType == 'Individual' && (
          <IndividualProfile
            user={user}
            id={Number(id.toString())}
          ></IndividualProfile>
        )}
      </div>
    </main>
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
