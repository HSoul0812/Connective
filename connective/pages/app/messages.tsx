import { useState, useEffect, createContext, useMemo } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/router'
import { withIronSession } from 'next-iron-session'
import { Conversations, Chat, UserDetails } from '../../components/messages'
import { User, Conversation } from '../../types/types'
import Layout from '../../components/layout'
import {
  MessagesApiResponse,
  ProfileApiResponse,
} from '../../types/apiResponseTypes'

export const MessagesContext = createContext<{
  conversations?: Conversation[]
}>({ conversations: [] })

export const MessagesProvider = MessagesContext.Provider

const Messages = ({ user }) => {
  const router = useRouter()
  const { newUser } = router.query
  const [users, setUsers] = useState<User[]>([])
  const [showUserdetail, setShowUserDetail] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<Conversation>()
  const currentUser = useMemo(() => {
    return users.find((item) => item.id === user.id)
  }, [users])

  // Automatically open latest (last opened) conversation when navigating to messages page
  useEffect(() => {
    let x: (prevState: undefined) => undefined
    if (sessionStorage.selectedUser) x = JSON.parse(sessionStorage.selectedUser)
    if (x !== undefined) {
      setSelectedUser(x)
    }
  }, [])
  useEffect(() => {
    window.sessionStorage.setItem('currentUser', JSON.stringify(user))
    if (selectedUser != undefined) {
      window.sessionStorage.setItem(
        'selectedUser',
        JSON.stringify(selectedUser),
      )
    }
  }, [selectedUser])

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [sum, setSum] = useState()
  const [unreadMessages, setUnreadMessages] = useState([])
  const getUsers = async () => {
    const data: ProfileApiResponse.IProfiles = (
      await axios.get('/api/profiles/all')
    ).data
    console.log('user: ', user)
    console.log('users: ', data.users)
    setUsers(data.users)
    if (newUser) {
      const temp = data.users.filter((item) => item.id.toString() == newUser)[0]
      const selectedUser = {
        id: temp.id,
        email: temp.email,
        username: temp.username,
        location: '',
        logo: temp.logo,
      } as Conversation
      setSelectedUser(selectedUser)
    }
  }

  const getConversations = async () => {
    try {
      const data: MessagesApiResponse.IConversations = (
        await axios.get('/api/messages/conversations')
      ).data
      // let tempConversations = data.conversations;
      let conversations = data.conversations
      conversations = conversations.map((conversation) => {
        if (conversation.id === selectedUser?.id) {
          return {
            ...conversation,
            unread: 0,
          }
        }
        return conversation
      })
      setConversations(conversations)
      // setSum(unreadMessages?.reduce((a, v) => a + v, 0));
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    // setConversations(mockConversationData)
    // setUsers(mockUserList)
    getUsers()
    getConversations()
  }, [])

  return (
    <MessagesProvider value={{ conversations }}>
      <Layout user={user} title="Messages">
        <div className="absolute flex flex-row right-0 top-0 gap-1">
          <div className="flex mt-[22px] ml-[40px] mb-[50px] 2bp:m-0 2bp:mt-[55px] items-center">
            <div className="relative mr-5">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                placeholder="Search here..."
                className={`placeholder:text-sm outline-none w-full pl-[36px] pr-[14px] text-sm py-2 rounded-lg outline-gray/5 focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300`}
              />
            </div>
            <div className="bg-gray/[0.2] rounded-full items-center flex p-[10px]">
              <Image src="/assets/messages/alarm.svg" height={20} width={20} />
            </div>
            <div className="flex items-center ml-5 mr-3">
              <Image src={user.logo} height={40} width={40} />
              <div className="ml-3 mr-5">
                <div className="font-bold text-sm">{user.username}</div>
                <div className="text-sm text-gray">Mananger</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white h-full overflow-clip flex flex-row">
          <Conversations
            unreadMessages={unreadMessages}
            selectedUser={selectedUser}
            conversations={conversations}
            setSelectedUser={setSelectedUser}
          />
          <div className="h-full w-[5px] bg-[#F8F9FA]"></div>
          <Chat
            userList={users}
            user={user}
            selectedUser={selectedUser}
            conversations={conversations}
            getConversations={getConversations}
            setConversations={setConversations}
            showUserDetail={() => setShowUserDetail(!showUserdetail)}
          />
          <div className="h-full w-[5px] bg-[#F8F9FA]"></div>
          {showUserdetail && (
            <UserDetails
              selectedUser={selectedUser}
              onClose={() => setShowUserDetail(false)}
            />
          )}
        </div>
      </Layout>
    </MessagesProvider>
  )
}

export default Messages

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
