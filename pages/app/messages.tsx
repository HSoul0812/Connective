import { useState, useEffect, createContext } from 'react'
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

  ///      mock data part
  const mockCurrentUser = {
    id: 123,
    email: 'pratham@gmail.com',
    username: 'Pratham Doshi',
    location: 'Cortana IL',
    logo: '/assets/Pratham.svg',
    typename: 'Conversation',
  }
  const mockConversationData = [
    {
      id: 1,
      email: 'Kyle@gmail.com',
      username: 'Kyle',
      logo: '/assets/messages/person1.svg',
      location: 'I like talk shows',
      typename: 'Conversation',
    },
    {
      id: 2,
      email: 'Kathryn@gmail.com',
      username: 'Kathryn Cooper',
      location: 'Kathryn location',
      logo: '/assets/messages/person1.svg',
      unread: 3,
      typename: 'Conversation',
    },
    {
      id: 3,
      email: 'Arthur@gmail.com',
      username: 'Arthur Cooper',
      location: 'Arthur location',
      logo: '/assets/messages/person1.svg',
      unread: 1,
      typename: 'Conversation',
    },
  ] as Conversation[]

  const mockUserList = [
    {
      id: 1,
      username: 'Kyle',
      email: 'Kyle@gmail.com',
      logo: '/assets/messages/person1.svg',
    },
    {
      id: 2,
      username: 'Kathryn@gmail.com',
      logo: '/assets/messages/person1.svg',
      email: 'Kathryn',
    },
    {
      id: 3,
      username: 'Arthur@gmail.com',
      logo: '/assets/messages/person1.svg',
      email: 'Arthur',
    },
  ] as User[]

  // Automatically open latest (last opened) conversation when navigating to messages page
  useEffect(() => {
    let x: (prevState: undefined) => undefined
    if (sessionStorage.selectedUser) x = JSON.parse(sessionStorage.selectedUser)
    if (x !== undefined) {
      setSelectedUser(x)
    }
  }, [])
  useEffect(() => {
    window.sessionStorage.setItem(
      'currentUser',
      JSON.stringify(mockCurrentUser),
    )
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
    setConversations(mockConversationData)
    setUsers(mockUserList)
    // getUsers()
    // getConversations()
  }, [])

  return (
    <MessagesProvider value={{ conversations }}>
      <Layout user={user} title="Messages">
        <div className="bg-white h-full overflow-clip mt-5 flex flex-row">
          <Conversations
            unreadMessages={unreadMessages}
            selectedUser={selectedUser}
            conversations={conversations}
            setSelectedUser={setSelectedUser}
          />
          <Chat
            userList={users}
            currentAccountUser={mockCurrentUser}
            selectedUser={selectedUser}
            conversations={conversations}
            getConversations={getConversations}
            setConversations={setConversations}
            showUserDetail={() => setShowUserDetail(true)}
          />
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
