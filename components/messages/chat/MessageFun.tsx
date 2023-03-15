import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { Message, User } from '../../../types/types'
import {
  getFormatDate,
  getFormatTime,
  IsSameDate,
} from '../../../util/validation/onboarding'

type PropsMessage = {
  message: Message
  showDate: boolean
  showAvatar: boolean
  userList: User[]
  isSender: boolean
}

const MessageFun = ({
  message,
  userList,
  showDate,
  showAvatar,
  isSender,
}: PropsMessage) => {
  const { text, timestamp, id } = message

  const sender = useMemo(() => userList.find((user) => user.id === id), [
    message,
    userList,
  ])

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
          <div className="float-right mr-2 mt-1">
            {getFormatTime(new Date(timestamp))}
          </div>
        </div>
      ) : (
        <div>
          {showDate && (
            <p className="text-lg text-purple ml-[50px]">{sender.username}</p>
          )}
          <div className="flex">
            {showAvatar ? (
              <div className="flex items-end mr-2">
                <Image
                  src={sender?.logo}
                  alt={sender?.username}
                  width={44}
                  height={44}
                />
              </div>
            ) : (
              <div className="w-[44px] h-[44px] mr-2"></div>
            )}
            <p className="bg-slate-100 w-fit rounded-t-xl rounded-br-xl bg-gray/[.2] p-[18px]">
              {text}
            </p>
          </div>
          <div className="ml-[50px]">{getFormatTime(new Date(timestamp))}</div>
        </div>
      )}
    </>
  )
}

export default MessageFun
