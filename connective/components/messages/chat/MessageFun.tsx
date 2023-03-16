import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Message, User } from 'types/types'
import { getFormatDate, getFormatTime } from 'util/validation/onboarding'

type PropsMessage = {
  message: Message
  showDate: boolean
  showAvatar: boolean
  showName: boolean
  isSender: boolean
}

const MessageFun = ({
  message,
  showDate,
  showAvatar,
  showName,
  isSender,
}: PropsMessage) => {
  const [selectedUser, setSelectedUser] = useState<User>()
  const { text, timestamp } = message

  useEffect(() => {
    setSelectedUser(JSON.parse(window.sessionStorage.getItem('selectedUser')))
  }, [setSelectedUser])

  return (
    <>
      {showDate && (
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-lightGray opacity-20"></div>
          <span className="flex-shrink mx-4 text-gray">
            {getFormatDate(new Date(timestamp))}
          </span>
          <div className="flex-grow border-t border-lightGray opacity-20"></div>
        </div>
      )}
      {isSender ? (
        <div>
          <p className="ml-auto text-right bg-blue-100 w-fit rounded-t-xl rounded-bl-xl p-[18px]">
            {text}
          </p>
          <div className="float-right mr-2 mt-1 text-[14px]">
            {getFormatTime(new Date(timestamp))}
          </div>
        </div>
      ) : (
        <div>
          {(showDate || showName) && (
            <p className="text-lg text-purple ml-[52px] mb-1">
              {selectedUser?.username}
            </p>
          )}
          <div className="flex">
            {showAvatar ? (
              <div className="flex items-end mr-2 rounded-full">
                <Image
                  src={selectedUser?.logo}
                  alt={selectedUser?.username}
                  width={44}
                  height={44}
                  className="rounded-full"
                />
              </div>
            ) : (
              <div className="w-[44px] h-[44px] mr-2"></div>
            )}
            <p className="bg-gray w-fit rounded-t-xl rounded-br-xl bg-gray/[.2] p-[18px]">
              {text}
            </p>
          </div>
          <div className="text-[14px] ml-[52px]">
            {getFormatTime(new Date(timestamp))}
          </div>
        </div>
      )}
    </>
  )
}

export default MessageFun
