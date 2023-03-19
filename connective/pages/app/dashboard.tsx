import axios from 'axios'
import { useState, useEffect } from 'react'
import { withIronSession } from 'next-iron-session'
import * as Routes from '../../util/routes'
import Sidebar from '../../components/sidebar'
import Util from '../../util'
import Layout from '../../components/layout'
import ButtonDark from '../../components/button-dark'
import { useRouter } from 'next/router'
import Head from 'next/head'

const DashboardItem = ({ title, value, icon, color }) => {
  return (
    <div className="flex flex-col pr-4 py-7 w-[260px] gap-2">
      <div className="flex flex-row gap-5 mr-20">
        <p className="font-[Poppins] font-medium text-[12px] leading-[18px] text-[#8A8888]">
          {title}
        </p>
      </div>
      <p className="font-[Montserrat] font-bold text-[32px] leading-[39px] text-[#0D1011]">
        {value == '$undefined' ? '' : value}
      </p>
    </div>
  )
}

const DashboardRow = ({ title, buttonText, children }) => {
  return (
    <div className="ml-[64px]">
      <Head>
        <title>Dashboard - Connective</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <p className="text-2xl font-bold">{title}</p>
      <div className="w-fit">
        <div className="flex flex-row justify-between py-6 w-fit gap-6 rounded-xl">
          {children}
        </div>
        {/* <ButtonDark
          onClick={buttonOnClick}
          text={buttonText}
           className="w-[270px]"
        ></ButtonDark> */}
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-[1px] h-fill bg-black/10 my-3 mr-[40px]"></div>
}

export default function Dashboard({ user, buttonOnClick }) {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState<boolean>(true)
  const [data, setData] = useState<any>()

  const getVerified = async () => {
    const { data } = await axios.get('/api/stripe/UserValidated')
    setIsVerified(data.verified)
  }

  const getData = async () => {
    let type = await Util.accountType(user.id)
    if (type == 'Business') {
      let { data } = await axios.get('/api/dashboard/business')
      console.log(data)
      setData(data)
    } else {
      let { data } = await axios.get('/api/dashboard/individual')
      console.log(data)
      setData(data)
    }
  }

  useEffect(() => {
    getVerified()
    getData()
  }, [])

  const connectwithBankDetails = async () => {
    const { data } = await axios.post('/api/stripe/connect-seller')
    console.log(data)
    window.open(data.accountLink, '_blank')
  }

  return (
    <Layout user={user} title="Dashboard">
      {!isVerified && (
        <div className="mx-auto w-fit flex flex-row gap-5 bg-[#FCFCFC] rounded-lg shadow p-5 mt-[40px]">
          <p className="my-auto text-[16px]">
            Enter your payment details to begin buying & selling lists:
          </p>
          <ButtonDark
            text="Connect"
            onClick={connectwithBankDetails}
            className="w-fit text-sm bg-[#0F172A]"
          />
        </div>
      )}

      {/* Buttons top right*/}
      <div className="absolute flex flex-row right-0 ml-[64px] gap-1 mt-[55px] mr-[100px]">
        <div className="border-[1px] border-[#0F172A] mr-4 rounded-[8px] hover:text-white hover:bg-[#1f2b45]">
          <ButtonDark
            onClick={() => {
              router.push(Routes.MARKTEPLACE)
            }}
            text="Explore Marketplace"
            className="w-[180px] bg-white text-sm text-[#0F172A] rounded-[8px] hover:text-white hover:bg-[#1f2b45]"
          />
        </div>
        <ButtonDark
          onClick={() => {
            router.push(`${Routes.LISTCREATE}/1`)
          }}
          text="Create a List"
          className="text-sm mr-10 bg-[#0F172A] text-white"
        />
      </div>

      {/* Stats */}
      <div className="flex flex-row ml-[64px] gap-1 mb-20 mt-20">
        <DashboardItem
          title="EARNINGS"
          value={'$' + data?.totalEarned}
          icon="/assets/dashboard/money.svg"
          color="#D3EBD5"
        ></DashboardItem>

        <Divider />
        <DashboardItem
          title="TOTAL SPENT"
          value={'$' + data?.totalSpent}
          icon="/assets/dashboard/money.svg"
          color="#D3EBD5"
        ></DashboardItem>
      </div>

      <div className="flex flex-row gap-6">
        <DashboardRow title="Buyer" buttonText="Explore Marketplace">
          <div className="border-[1px] border-[#0D1011]/[.10] rounded-[10px]">
            <div className="pl-4">
              <DashboardItem
                title="Lists Viewed"
                value={data?.listsViewed == null ? 0 : data.listsViewed}
                icon="/assets/dashboard/list.svg"
                color="#CCE0FE"
              ></DashboardItem>
            </div>
          </div>
          <div className="border-[1px] border-[#0D1011]/[.10] rounded-[10px]">
            <div className="pl-4">
              <DashboardItem
                title="Lists Bought"
                value={data?.purchasedLists}
                icon="/assets/dashboard/listCheck.svg"
                color="#CCE0FE"
              ></DashboardItem>
            </div>
          </div>
        </DashboardRow>

        <DashboardRow title="Seller" buttonText="Create a List">
          <div className="border-[1px] border-[#0D1011]/[.10] rounded-[10px]">
            <div className="pl-4">
              <DashboardItem
                title="List Created"
                value={data?.listsCreated}
                icon="/assets/dashboard/list.svg"
                color="#CCE0FE"
              ></DashboardItem>
            </div>
          </div>
          <div className="border-[1px] border-[#0D1011]/[.10] rounded-[10px]">
            <div className="pl-4">
              <DashboardItem
                title="Lists Sold"
                value={data?.listsSold}
                icon="/assets/dashboard/list.svg"
                color="#CCE0FE"
              ></DashboardItem>
            </div>
          </div>
        </DashboardRow>
      </div>
    </Layout>
  )
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get('user')

    if (!user) {
      return { props: {} }
    }

    return {
      props: { user },
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
