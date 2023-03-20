import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { MessagesContext } from '../../pages/app/messages'
import { io } from 'socket.io-client'
import { Events } from '../../common/events'
import { Conversation } from '../../types/types'
import { MessagesApiResponse } from '../../types/apiResponseTypes'
import * as Routes from '../../util/routes'

type Props = {
  text: string
  text2?: string | number
  route?: string
  icon: string
  onClick?: MouseEventHandler<HTMLDivElement>
  target?: string
}

let socketIO

const SidebarItem = ({
  text,
  text2 = '',
  route = '',
  icon,
  onClick = undefined,
  target = undefined,
}: Props) => {
  const router = useRouter()

  let selected =
    router.route.includes('profile') && route.includes('profile')
      ? true
      : router.route == route
  if (typeof onClick == 'undefined') {
    onClick = () => {
      router.push(route)
    }
  }
  if (typeof target != 'undefined') {
    onClick = () => {
      window.open(route, '_blank')
    }
  }

  return (
    <div
      onClick={onClick}
      className={`
      flex flex-row items-center gap-3 cursor-pointer text-[14px] pl-3 py-[16.5px] my-3 w-full transition-all text-gray hover:border-gradient-br-purple-transparent gradient-border-2 rounded-xl
       ${selected ? 'border-gradient-br-purple-transparent' : ''}
       ${text == 'Sign Out' ? 'mt-auto' : ''}`}
    >
      <img
        className={`w-[18px] h-[18px] my-auto ${
          selected ? 'icon-filtering' : ''
        } `}
        src={icon}
      />
      <p className={`${selected ? 'text-purple' : ''}`}>{text}</p>
      <p className="rounded-full px-1 bg-purple text-white">{text2}</p>
    </div>
  )
}

const Sidebar = ({ user }) => {
  const router = useRouter()
  const { conversations } = useContext(MessagesContext)
  const [sum, setSum] = useState<number>()
  const { data: session } = useSession()

  const signout = async () => {
    try {
      await axios.get('/api/auth/destroysession')
      if (session) {
        await signOut()
      }
    } catch (e) {
      console.log(e)
    } finally {
      router.push(Routes.LANDING)
    }
  }

  const calculateUnReadMessages = useCallback(
    (conversations: Conversation[]) => {
      return (
        conversations?.reduce(
          (previous, current) => current.unread + previous,
          0,
        ) || 0
      )
    },
    [],
  )

  const getConversations = useCallback(async () => {
    try {
      const data: MessagesApiResponse.IConversations = (
        await axios.get('/api/messages/conversations')
      ).data
      const sum = calculateUnReadMessages(data.conversations)
      setSum(sum)
    } catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    if (user) {
      if (!socketIO) {
        socketIO = io(process.env.NEXT_PUBLIC_SOCKET_HOST)

        socketIO.on(Events.DISCONNECT, () => {
          socketIO = null
        })
      }

      if (typeof Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID === 'function') {
        socketIO.on(
          Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID(user.id),
          (conversations: Conversation[]) => {
            const sum: number = calculateUnReadMessages(conversations)
            setSum(sum)
          },
        )
      }
      return () => {
        if (typeof Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID === 'function') {
          socketIO?.off(Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID(user.id))
        }
      }
    }
  }, [user])

  useEffect(() => {
    if (conversations?.length) {
      const updatedSum: number = calculateUnReadMessages(conversations)
      console.log({ updatedSum, sum })
      if (updatedSum < sum) {
        setSum(updatedSum)
      }
    }
  }, [conversations])

  useEffect(() => {
    getConversations()
  }, [getConversations])

  return (
    <div className="z-10 min-w-[25vh] w-1/6 bg-[#F8F9FA] flex flex-col text-white font-[Montserrat] px-[30px] py-[25px]">
      <Link href="/">
        <div className="flex flex-row cursor-pointer items-center mb-9">
          <Image
            src="/assets/messages/logoIcon.svg"
            width={41}
            height={41}
            priority
          />
          <div className="ml-2 flex items-center">
            <Image
              src="/assets/messages/logoText.svg"
              width={125}
              height={20}
              priority
            />
          </div>
        </div>
      </Link>

      <div className="mt-4">
        <SidebarItem
          text="Dashboard"
          icon="/assets/navbar/DashboardIcon.svg"
          route="/app/dashboard"
        />

        <SidebarItem
          text="Profile"
          icon="/assets/navbar/ProfileIcon.svg"
          route={`/app/profile/${user?.id ? user.id : 0}`}
        />
      </div>

      {/*
      <div  className="mb-3">
        <p  className="font-[Montserrat] font-bold text-[18px] leading-[20px] text-[#BFBFBF] mb-2">
          As a buyer
        </p>
        <SidebarItem
          text="Marketplace"
          icon="/assets/navbar/MarketplaceIcon.svg"
          route="/app/marketplace"
        />
        <SidebarItem
          text="Purchased Lists"
          icon="/assets/navbar/PurchasedListsIcon.svg"
          route="/app/lists/purchased"
        />
      </div>

      <div  className="mb-3">
        <p  className="font-[Montserrat] font-bold text-[18px] leading-[20px] text-[#BFBFBF] mb-2">
          As a seller
        </p>
        <SidebarItem
          text="Lists"
          icon="/assets/navbar/ListsIcon.svg"
          route="/app/lists"
        />
        <SidebarItem
          text="Earnings"
          icon="/assets/navbar/EarningsIcon.svg"
          route="/app/earnings"
        />
        <SidebarItem
          text="Requests List"
          icon="/assets/navbar/RequestsListIcon.svg"
          route="/app/requests"
        />
      </div>
      */}
      <div className="mt-4">
        <p className="font-[Montserrat] font-bold text-[18px] leading-[20px] text-[#BFBFBF] mb-2">
          CHAT
        </p>
        <SidebarItem
          text="Messages"
          text2={sum && sum > 0 ? sum : null}
          icon="/assets/navbar/messages.svg"
          route="/app/messages"
        />
        <SidebarItem
          text="Discover"
          icon="/assets/navbar/compass.svg"
          route="/app/discover"
        />
      </div>

      <div className="mt-4">
        <p className="font-[Montserrat] font-bold text-[18px] leading-[20px] text-[#BFBFBF] mb-2">
          Support
        </p>
        {/* <SidebarItem
          text="Feedback"
          icon="/assets/navbar/FeedbackIcon.svg"
          route="/app/feedback"
        /> */}
        <SidebarItem
          text="Contact Us"
          icon="/assets/navbar/ContactUsIcon.svg"
          route="https://calendly.com/connective-app/30min?month=2022-12"
          target="_blank"
        />
        <SidebarItem
          text="Join Our Slack"
          icon="/assets/navbar/Slack.svg"
          route="https://join.slack.com/t/connectiveaff-gdx2039/shared_invite/zt-1k972uih0-fn~2DbSdWPR8fTNRl~HCkw"
          target="_blank"
        />
      </div>

      {/* <Link href="http://www.connective-app.xyz/"> */}
      <SidebarItem
        text="Sign Out"
        icon="/assets/navbar/SignOutIcon.svg"
        onClick={signout}
      />
      {/* </Link> */}
    </div>
  )
}

export default Sidebar
