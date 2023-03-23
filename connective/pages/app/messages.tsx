import { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { withIronSession } from 'next-iron-session'
import { Recache } from 'recache-client'

import Layout from 'components/layout'
import { Conversations, Chat, UserDetails } from 'components/messages'
import {
  MessagesApiResponse,
  ProfileApiResponse,
  IApiResponseError,
} from 'types/apiResponseTypes'
import { User, Conversation } from 'types/types'

export const MessagesContext = createContext<{
  conversations?: Conversation[]
}>({ conversations: [] })

export const MessagesProvider = MessagesContext.Provider

const Messages = ({ user }) => {
  const router = useRouter()
  const { newUser } = router.query
  const [users, setUsers] = useState<User[]>([])
  const [userInfo, setUserInfo] = useState<any>()
  const [showUserdetail, setShowUserDetail] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<Conversation>()

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
    const res: ProfileApiResponse.IDiscoverProfiles | IApiResponseError = (
      await Recache.cached(137, axios.get, ['/api/profiles'])
    ).data
    if (res.type == 'IApiResponseError') throw res
    else {
      setUserInfo(res.users.find((item) => item.id === user.id))
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
    getUsers()
    getConversations()
  }, [])

  return (
    <MessagesProvider value={{ conversations }}>
      <Layout
        user={{ ...user, logo: userInfo?.logo, name: userInfo?.username }}
        title="Messages"
      >
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
