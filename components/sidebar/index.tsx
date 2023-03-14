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

type Props = {
  text: string
  text2?: string | number
  route?: string | URL
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

  let selected = router.route == route
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
      className={`flex flex-row gap-5 cursor-pointer text-[1.65vh] 2xl:text-[1.4vh] pl-6 py-[1.25vh] 2xl:py-[1.5vh] w-full transition-all hover:bg-[#051533]/10 ${
        selected ? 'bg-[#051533]' : ''
      } ${text == 'Sign Out' ? 'mt-auto' : ''}`}
    >
      <img className="w-[2vh] h-[2vh] my-auto" src={icon} />
      <p>{text}</p>
      <p>{text2}</p>
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
      router.push('/')
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
    // try {
    //   const data: MessagesApiResponse.IConversations = (
    //     await axios.get("/api/messages/conversations")
    //   ).data;
    //   const sum = calculateUnReadMessages(data.conversations);
    //   setSum(sum);
    // } catch (e) {
    //   console.log(e);
    // }
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
    <div className="z-10 h-fill min-w-[30vh] bg-[#061A40] flex flex-col text-white font-[Montserrat] px-[32px] py-[30px]">
      <Link href="/">
        <div className="flex flex-row cursor-pointer items-center gap-2 mb-9">
          <Image
            className="w-[2vh] h-[4vh]"
            src="/assets/logo-1.svg"
            width="70px"
            height="75px"
            priority
          />
          <Image
            className="w-[5vh] h-[1.5vh]"
            src="/assets/logo-2.svg"
            width="196px"
            height="36px"
            priority
          />
        </div>
      </Link>

      <div className="mb-3">
        <p className="font-[Montserrat] font-bold text-[1.5vh] leading-[20px] text-[#BFBFBF] mb-2">
          General
        </p>
        {/*
        <SidebarItem
          text="Dashboard"
          icon="/assets/navbar/DashboardIcon.svg"
          route="/app/dashboard"
        ></SidebarItem>
        */}
        <SidebarItem
          text="Profile"
          icon="/assets/navbar/ProfileIcon.svg"
          route={`/app/profile/${user?.id ? user.id : 0}`}
        ></SidebarItem>
      </div>

      {/*
      <div  className="mb-3">
        <p  className="font-[Montserrat] font-bold text-[1.5vh] leading-[20px] text-[#BFBFBF] mb-2">
          As a buyer
        </p>
        <SidebarItem
          text="Marketplace"
          icon="/assets/navbar/MarketplaceIcon.svg"
          route="/app/marketplace"
        ></SidebarItem>
        <SidebarItem
          text="Purchased Lists"
          icon="/assets/navbar/PurchasedListsIcon.svg"
          route="/app/lists/purchased"
        ></SidebarItem>
      </div>

      <div  className="mb-3">
        <p  className="font-[Montserrat] font-bold text-[1.5vh] leading-[20px] text-[#BFBFBF] mb-2">
          As a seller
        </p>
        <SidebarItem
          text="Lists"
          icon="/assets/navbar/ListsIcon.svg"
          route="/app/lists"
        ></SidebarItem>
        <SidebarItem
          text="Earnings"
          icon="/assets/navbar/EarningsIcon.svg"
          route="/app/earnings"
        ></SidebarItem>
        <SidebarItem
          text="Requests List"
          icon="/assets/navbar/RequestsListIcon.svg"
          route="/app/requests"
        ></SidebarItem>
      </div>
      */}
      <div className="mb-3">
        <p className="font-[Montserrat] font-bold text-[1.5vh] leading-[20px] text-[#BFBFBF] mb-2">
          Chat
        </p>
        <SidebarItem
          text="Discover"
          icon="/assets/navbar/compass.svg"
          route="/app/discover"
        ></SidebarItem>
        <SidebarItem
          text="Messages"
          text2={sum && sum > 0 ? sum : null}
          icon="/assets/navbar/messages.png"
          route="/app/messages"
        ></SidebarItem>
      </div>

      <div className="mb-3">
        <p className="font-[Montserrat] font-bold text-[1.5vh] leading-[20px] text-[#BFBFBF] mb-2">
          Support
        </p>
        {/* <SidebarItem
          text="Feedback"
          icon="/assets/navbar/FeedbackIcon.svg"
          route="/app/feedback"
        ></SidebarItem> */}
        <SidebarItem
          text="Contact Us"
          icon="/assets/navbar/ContactUsIcon.svg"
          route="https://calendly.com/connective-app/30min?month=2022-12"
          target="_blank"
        ></SidebarItem>
        <SidebarItem
          text="Join Our Slack"
          icon="/assets/navbar/Slack.svg"
          route="https://join.slack.com/t/connectiveaff-gdx2039/shared_invite/zt-1k972uih0-fn~2DbSdWPR8fTNRl~HCkw"
          target="_blank"
        ></SidebarItem>
      </div>

      {/* <Link href="http://www.connective-app.xyz/"> */}
      <SidebarItem
        text="Sign Out"
        icon="/assets/navbar/SignOutIcon.svg"
        onClick={signout}
      ></SidebarItem>
      {/* </Link> */}
    </div>
  )
}

export default Sidebar
