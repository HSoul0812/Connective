import { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Recache } from 'recache-client'
import { withIronSession } from 'next-iron-session'

import Layout from 'components/layout'
import BusinessProfile from 'components/profile/business'
import IndividualProfile from 'components/profile/individual'
import * as Routes from 'util/routes'
import Util from 'util/index'
import { DAO } from 'lib/dao'

export default function Profile({ user, industries }) {
  const [accountType, setAccountType] = useState<boolean>()
  const router = useRouter()
  const { id } = router.query
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    try {
      Recache.logEvent_AutodetectIp('profile')
    } catch (e) {
      console.log(e)
    }
  }, [])

  const getAccountType = async () => {
    const type = await Util.accountType(Number(id.toString()))
    setAccountType(type)
  }

  useEffect(() => {
    if (typeof user == 'undefined') router.push(Routes.SIGNIN)
    getAccountType()
  }, [user])

  return (
    <Layout user={user} title="Profile/About">
      <main className="flex flex-row h-screen min-w-screen font-[Montserrat] bg-[#F5F5F5]">
        <Head>
          <title>Profile - Connective</title>
        </Head>
        <div className="h-screen w-screen overflow-y-scroll">
          <div
            className={`${loaded ? 'flex' : 'hidden'} flex-col w-[100%] h-full`}
          >
            <div className="relative">
              <div
                onClick={(e) => e.stopPropagation()}
                className={`after:absolute after:top-[20px] `}
              >
                <img
                  className="h-[25%] w-[100%] object-cover relative shadow-md rounded-[12px]"
                  src="/assets/profile/bg.svg"
                />
                <div
                  className="absolute top-[20px] right-[20px] cursor-pointer bg-white/[0.2] rounded-full w-[40px] h-[40px] flex items-center justify-center"
                  onClick={() => console.log('asdf')}
                >
                  <Image
                    src="/assets/profile/edit-white.svg"
                    height={24}
                    width={24}
                  />
                </div>
              </div>
            </div>
            {accountType ? (
              <BusinessProfile
                user={user}
                industries={industries}
                id={Number(id.toString())}
                setLoaded={setLoaded}
              />
            ) : (
              <IndividualProfile
                user={user}
                id={Number(id.toString())}
                setLoaded={setLoaded}
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
