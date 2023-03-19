import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { withIronSession } from 'next-iron-session'
import Sidebar from '../../../components/sidebar'
import EditBusinessProfile from '../../../components/edit-profile/business'
import EditIndividualProfile from '../../../components/edit-profile/individual'
import Util from '../../../util'
import Head from 'next/head'
import * as Routes from '../../../util/routes'
import { DAO } from '../../../lib/dao'

export default function EditProfile({ user, industries }) {
  const router = useRouter()

  const [accountType, setAccountType] = useState<string>()

  const getAccountType = async () => {
    if (user) setAccountType(await Util.accountType(user.id))
  }

  useEffect(() => {
    getAccountType()
  }, [])

  useEffect(() => {
    if (typeof user == 'undefined') router.push(Routes.SIGNIN)
  }, [user])

  return (
    <main className="flex flex-row h-screen min-w-screen font-[Montserrat] bg-[#F5F5F5]">
      <Head>
        <title>Edit Profile - Connective</title>
      </Head>

      <Sidebar user={user}></Sidebar>
      <div className="h-screen w-screen overflow-y-scroll">
        {accountType == 'Business' && (
          <EditBusinessProfile
            user={user}
            industries={industries}
          ></EditBusinessProfile>
        )}
        {accountType == 'Individual' && (
          <EditIndividualProfile user={user}></EditIndividualProfile>
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
