import axios from 'axios'
import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  createContext,
} from 'react'
import { withIronSession } from 'next-iron-session'
import { Recache } from 'recache-client'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../../components/layout'
import Avatar from '../../components/avatar'
import { User, Message, Conversation } from '../../types/types'
import {
  MessagesApiResponse,
  IApiResponseError,
  ProfileApiResponse,
} from '../../types/apiResponseTypes'

type PropsMessage = {
  text: string
  sent: boolean
}
import { io } from 'socket.io-client'
import { Events } from '../../common/events'

let socketIO

export const MessagesContext = createContext<{
  conversations?: Conversation[]
}>({ conversations: [] })
export const MessagesProvider = MessagesContext.Provider

const MessageFun = ({ text, sent }: PropsMessage) => {
  return (
    <>
      {sent ? (
        <div className="ml-auto bg-blue-100 w-3/5 p-2 rounded-lg shadow-md">
          <p>{text}</p>
        </div>
      ) : (
        <div className="bg-slate-100 w-3/5 p-2 rounded-lg shadow">
          <p>{text}</p>
        </div>
      )}
    </>
  )
}

type PropsConversations = {
  selectedUser: Conversation
  setSelectedUser: Dispatch<SetStateAction<Conversation>>
  conversations: Array<Conversation>
  unreadMessages: Array<number>
}

const Conversations = ({
  selectedUser,
  setSelectedUser,
  conversations,
  unreadMessages,
}: PropsConversations) => {
  const [filter, setFilter] = useState<string>('')
  const [filteredConversations, setFilteredConversations] = useState<
    Array<Conversation>
  >([])

  useEffect(() => {
    try {
      Recache.logEvent_AutodetectIp('messages')
    } catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    setFilteredConversations([...conversations])
  }, [conversations])

  useEffect(() => {
    if (filter != '')
      setFilteredConversations(
        conversations.filter(
          (a: { username: string; email: string }) =>
            a.username.toLowerCase().includes(filter.toLowerCase()) ||
            a.email.toLowerCase().includes(filter.toLowerCase()),
        ),
      )
  }, [filter])

  return (
    <div className="flex flex-col w-1/5 overflow-y-scroll bg-white min-w-[375px]">
      <Head>
        <title>Messages - Conenctive</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="relative mx-[28px] my-[14px]">
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
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          placeholder="Search..."
          onChange={(e) => {
            setFilter(e.target.value)
          }}
          className={`outline-none w-full pl-[36px] pr-[14px] text-sm py-2 rounded-lg outline-gray/5 focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300`}
        />
      </div>

      {filteredConversations.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(item)
            }}
            className={`flex items-center  flex-row px-[28px] py-[18px] cursor-pointer text-sm border-b border-slate-200 w-full ${
              selectedUser?.id == item.id ? 'bg-white' : 'bg-slate-100'
            } hover:bg-slate-100/50 transition-all`}
          >
            <div className="w-1/5 h-full flex items-center">
              {item.logo ? (
                <img
                  src={item.logo}
                  className="w-full h-full bg-white rounded-full shadow-lg"
                />
              ) : (
                <Avatar
                  className="rounded-full shadow-lg"
                  width="50px"
                  height="50px"
                  title={item.username}
                />
              )}
            </div>
            <div className="flex flex-col ml-2 w-4/5 h-full justify-between">
              <div className="flex justify-between items-center">
                <p className="my-auto font-bold">{item.username}</p>
                <p className="my-auto text-gray">10:49</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray text-ellipsis w-full overflow-hidden whitespace-nowrap ">
                  this is mock data test ellipsis casethis is mock data test
                  ellipsis casethis is mock data test ellipsis casethis is mock
                  data test ellipsis case
                </p>

                {item.id !== selectedUser?.id && item.unread > 0 ? (
                  <span
                    className={`ml-auto bg-purple rounded-full min-w-[25px] min-h-[25px] text-white flex items-center justify-center`}
                  >
                    {item.unread}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

type PropsChat = {
  users: Array<User>
  selectedUser: Conversation
  user: User
  conversations: Array<Conversation>
  getConversations: () => Promise<void>
}

const Chat = ({
  users,
  selectedUser,
  user,
  conversations,
  getConversations,
  setConversations,
}) => {
  const [messages, setMessages] = useState([])
  const [isNewMessageArrived, setIsNewMessageArrived] = useState(false)
  const [showError, setShowError] = useState(false)
  const [socketToken, setSocketToken] = useState('abcd')
  const timeoutRef = useRef<any>(null)
  const [userOptions, setUserOptions] = useState([])
  const [text, setText] = useState('')
  let prevMessages = 0

  const scrollWindow = () => {
    document.getElementById('messages-container').scroll({
      top: document.getElementById('messages-container').scrollHeight,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    let temp = []
    users.forEach((user) => {
      temp.push({
        value: user.id,
        label: user.username + ' (' + user.email + ')',
      })
    })
    setUserOptions(temp)
  }, [users])

  // useEffect(()=>{
  //   if(user?.id && !socketToken){
  //     (async()=>{
  //       try {
  //         const { data: { key } } = await axios.get(`${process.env.NEXT_PUBLIC_SOCKET_HOST}/socket/connection/key/${user.id}`,
  //         { withCredentials: true })
  //         setSocketToken(key)
  //       } catch (error) {
  //         setShowError(true);
  //       }
  //     })()
  //   }
  // },[user, socketToken])

  useEffect(() => {
    if (user && selectedUser && socketToken) {
      if (!socketIO) {
        socketIO = io(process.env.NEXT_PUBLIC_SOCKET_HOST)

        socketIO.on(Events.DISCONNECT, () => {
          setShowError(true)
          socketIO = null
          setSocketToken('')
        })
      }
      if (typeof Events.NEW_MESSAGE_TO_ID === 'function') {
        socketIO.on(
          Events.NEW_MESSAGE_TO_ID(`${selectedUser.id}_${user.id}`),
          (msg) => {
            setMessages((prevMsgs) => {
              const msgs = [...prevMsgs]
              msgs.push(msg)
              return msgs
            })
            setIsNewMessageArrived(true)
            readMessages({ sender: selectedUser.id, receiver: user.id })
          },
        )
      }
      if (typeof Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID === 'function') {
        socketIO.on(
          Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID(user.id),
          (conversations) => {
            const mappedConversations = conversations.map((conversation) => {
              if (conversation.id === selectedUser?.id) {
                return {
                  ...conversation,
                  unread: 0,
                }
              }
              return conversation
            })
            setConversations(mappedConversations)
          },
        )
      }
      return () => {
        if (typeof Events.NEW_MESSAGE_TO_ID === 'function') {
          socketIO?.off(
            Events.NEW_MESSAGE_TO_ID(`${selectedUser.id}_${user.id}`),
          )
        }
        if (typeof Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID === 'function') {
          socketIO?.off(Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID(user.id))
        }
      }
    }
  }, [user, selectedUser, socketToken])

  useEffect(() => {
    if (isNewMessageArrived) {
      scrollWindow()
      setIsNewMessageArrived(false)
    }
  }, [isNewMessageArrived])

  useEffect(() => {
    if (selectedUser != null) {
      getMessages()
      const clonedConversations = [...conversations]
      const foundIndex = clonedConversations.findIndex(({ id }) => {
        return selectedUser.id === id
      })

      if (foundIndex > -1) {
        clonedConversations[foundIndex].unread = 0
      }
      setConversations(clonedConversations)
    } else {
      setMessages([])
    }
  }, [selectedUser])

  useEffect(() => {
    if (showError) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setShowError(false)
      }, 1500)
    }
  }, [showError])

  const sendMessage = async () => {
    if (
      (document.getElementById('message-input') as HTMLInputElement).value != ''
    ) {
      try {
        if (socketIO.connected) {
          ;(document.getElementById(
            'message-input',
          ) as HTMLInputElement).value = ''
          setMessages([...messages, { sender: user.id, text }])
          setIsNewMessageArrived(true)
          await axios.post('/api/messages/' + selectedUser.id, { text })
          socketIO.emit(Events.SEND_MESSAGE, {
            receiver: selectedUser.id,
            sender: user.id,
            text,
          })
          //Re-fetch the list of conversations if the message was sent to a new conversation

          if (
            conversations.filter((a) => a.id == selectedUser.id).length == 0
          ) {
            getConversations()
          }
        } else {
          setShowError(true)
        }
      } catch (e) {
        setShowError(true)
      }
    }
  }
  const getMessages = async () => {
    let temp = messages
    const { data } = await axios.get('/api/messages/' + selectedUser.id)
    prevMessages = data.length
    setMessages(data.messages)
    setIsNewMessageArrived(true)

    const emailz = await axios('/api/messages/unread-messages-mailer', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    await readMessages({ sender: selectedUser.id, receiver: user.id })
  }

  const readMessages = async ({ sender, receiver }) => {
    const data = {
      sender,
      receiver,
    }
    await axios.post('/api/messages/read-message', {
      header: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data,
    })
  }

  // Send message on pressing Enter key
  const messageInputRef = useRef(null)
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (
        event.key === 'Enter' &&
        document.activeElement === messageInputRef.current
      ) {
        document.getElementById('message-submit-button').click()
      }
    }
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  return (
    <div className="flex flex-col h-full w-4/5 rounded-r-lg">
      {selectedUser && (
        <div className="flex flex-row w-full p-2">
          <p className="font-medium text-lg w-full mt-2 pb-2 border-b-2 border-slate-100">
            {selectedUser?.username + ' (' + selectedUser?.email + ')'}
          </p>
        </div>
      )}

      <div
        id="messages-container"
        className="h-full overflow-y-scroll p-5 flex flex-col gap-10"
      >
        {messages?.map((item, index) => {
          return (
            <MessageFun
              text={item.text}
              sent={item.sender == user.id}
            ></MessageFun>
          )
        })}
      </div>
      {selectedUser && (
        <div className="flex flex-row p-5 gap-5">
          <input
            ref={messageInputRef}
            id="message-input"
            placeholder="Type something..."
            onChange={(e) => {
              setText(e.target.value)
            }}
            className="outline-none w-full pl-[32px] pr-[14px] text-[14px] h-[47px] border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"
          ></input>
          <button
            id="message-submit-button"
            className="w-fit px-10"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      )}
      {showError && (
        <div className="ml-3 text-sm font-normal text-red-400 mb-4">
          Error connecting to server!
        </div>
      )}
    </div>
  )
}

const UserDetails = ({ selectedUser }) => {
  return (
    <div className="w-1/5 h-full px-2 py-3">
      {selectedUser && (
        <>
          {selectedUser.logo ? (
            <img
              src={selectedUser.logo}
              className="w-12 h-12 bg-white rounded-full shadow-lg m-auto"
            />
          ) : (
            <Avatar
              className="rounded-full shadow-lg m-auto"
              width="30px"
              height="30px"
              title={selectedUser.username}
            />
          )}
          <p className="font-bold text-lg text-center mt-2">
            {selectedUser.username}
          </p>
          <p className="text-sm font-bold mt-4">Contact Details:</p>
          <div className="flex flex-row gap-2 my-3">
            <div className="bg-black/5 rounded-full p-[7px] w-8 h-8 shadow-lg">
              <img src="/assets/email.png"></img>
            </div>
            <p className="text-sm my-auto break-all">{selectedUser.email}</p>
          </div>
          <div className="flex flex-row gap-2">
            <div className="bg-black/5 rounded-full p-[7px] w-8 h-8 shadow-lg">
              <img src="/assets/location.png"></img>
            </div>
            <p className="text-sm my-auto break-all">{selectedUser.location}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default function Messages({ user }) {
  const router = useRouter()
  const { newUser } = router.query
  const [users, setUsers] = useState<User[]>([])
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
    if (selectedUser != undefined) {
      window.sessionStorage.setItem(
        'selectedUser',
        JSON.stringify(selectedUser),
      )
    }
  }, [selectedUser])

  ///      mock data part
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
    {
      id: 4,
      email: 'Arthur@gmail.com',
      username: 'Arthur Cooper',
      location: 'Arthur location',
      logo: '/assets/messages/person1.svg',
      unread: 1,
      typename: 'Conversation',
    },

    {
      id: 5,
      email: 'Arthur@gmail.com',
      username: 'Arthur Cooper',
      location: 'Arthur location',
      logo: '/assets/messages/person1.svg',
      unread: 1,
      typename: 'Conversation',
    },
    {
      id: 6,
      email: 'Arthur@gmail.com',
      username: 'Arthur Cooper',
      location: 'Arthur location',
      logo: '/assets/messages/person1.svg',
      unread: 1,
      typename: 'Conversation',
    },
    {
      id: 7,
      email: 'Arthur@gmail.com',
      username: 'Arthur Cooper',
      location: 'Arthur location',
      logo: '/assets/messages/person1.svg',
      unread: 1,
      typename: 'Conversation',
    },
    {
      id: 8,
      email: 'Arthur@gmail.com',
      username: 'Arthur Cooper',
      location: 'Arthur location',
      logo: '/assets/messages/person1.svg',
      unread: 1,
      typename: 'Conversation',
    },
    {
      id: 9,
      email: 'Arthur@gmail.com',
      username: 'Arthur Cooper',
      location: 'Arthur location',
      logo: '/assets/messages/person1.svg',
      unread: 1,
      typename: 'Conversation',
    },
    {
      id: 10,
      email: 'Arthur@gmail.com',
      username: 'Arthur Cooper',
      location: 'Arthur location',
      logo: '/assets/messages/person1.svg',
      unread: 1,
      typename: 'Conversation',
    },
  ]
  ///      mock data part ---------------- end
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
          ></Conversations>
          <Chat
            user={user}
            users={users}
            selectedUser={selectedUser}
            conversations={conversations}
            getConversations={getConversations}
            setConversations={setConversations}
          ></Chat>
          <UserDetails selectedUser={selectedUser}></UserDetails>
        </div>
      </Layout>
    </MessagesProvider>
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
