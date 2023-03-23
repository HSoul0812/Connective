import axios from 'axios'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { withIronSession } from 'next-iron-session'
import EditProfileComponent from 'components/edit-profile'
import Util from 'util/index'
import { DAO } from 'lib/dao'

export default function EditProfile({ user, industries }) {
  const router = useRouter()

  const [data, setData] = useState<any>()
  const [loaded, setLoaded] = useState<boolean>(false)
  const [accountType, setAccountType] = useState<boolean>()

  const getProfile = async () => {
    try {
      const type = await Util.accountType(user.id)
      if (user) setAccountType(type)
      let url = type ? '/api/profiles/business' : '/api/profiles/individual'
      await axios.get(`${url}?id=${user.id}`).then((res) => {
        let data = res.data
        if (data.type == 'IApiResponseError') {
          throw data
        } else {
          const result = type ? data.business : data.individual
          setData(result)
          setLoaded(true)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getProfile()
  }, [])

  useEffect(() => {
    console.log(user)
    // if (typeof user == 'undefined') router.push(Routes.SIGNIN)
  }, [user])

  return (
    <main className="flex flex-row h-screen min-w-screen font-[Montserrat] bg-[#F5F5F5]">
      <Head>
        <title>Edit Profile - Connective</title>
      </Head>
      {loaded ? (
        <div className="h-screen w-screen overflow-y-scroll">
          <EditProfileComponent
            data={data}
            isBusiness={accountType}
            user={user}
            industries={industries}
          />
        </div>
      ) : (
        <div>
          <p className="text-center">Loading...</p>
        </div>
      )}
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
