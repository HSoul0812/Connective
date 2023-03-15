import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Recache } from 'recache-client'
import Avatar from '../../../components/avatar'
import { Conversation } from '../../../types/types'

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
    setFilteredConversations(
      filter === ''
        ? conversations
        : conversations.filter(
            (a: { username: string; email: string }) =>
              a.username.toLowerCase().includes(filter.toLowerCase()) ||
              a.email.toLowerCase().includes(filter.toLowerCase()),
          ),
    )
  }, [filter])

  return (
    <div className="flex flex-col w-1/5 overflow-y-scroll bg-white min-w-[180px]">
      <Head>
        <title>Messages - Connective</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="relative mx-[28px] my-[14px] 2bp:mx-0">
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
          placeholder="Search..."
          onChange={(e) => {
            setFilter(e.target.value)
          }}
          className={`placeholder:text-sm outline-none w-full pl-[36px] pr-[14px] text-sm py-2 rounded-lg outline-gray/5 focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300`}
        />
      </div>

      {filteredConversations.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(item)
            }}
            className={`flex items-center  flex-row 2bp:pl-0 px-[28px] py-[18px] cursor-pointer text-sm border-b border-slate-200 w-full ${
              selectedUser?.id == item.id ? 'bg-white' : 'bg-slate-100'
            } hover:bg-slate-100/50 transition-all`}
          >
            <div className="h-full flex items-center mr-2">
              {item.logo ? (
                <div className="min-w-[40px] min-y-[40px]">
                  <Image
                    width="100%"
                    height="100%"
                    src={item.logo}
                    className="bg-white rounded-full shadow-lg"
                  />
                </div>
              ) : (
                <Avatar
                  className="rounded-full shadow-lg"
                  width="50px"
                  height="50px"
                  title={item.username}
                />
              )}
            </div>
            <div className="flex flex-col w-4/5 h-full justify-between">
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
export default Conversations
