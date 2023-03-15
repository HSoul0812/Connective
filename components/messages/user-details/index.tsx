import { useState } from 'react'
import Image from 'next/image'
import Switch from 'react-switch'
import Avatar from '../../avatar'

const UserDetails = ({ selectedUser, onClose }) => {
  const [checked, setChecked] = useState<boolean>(false)
  return (
    <div className="w-1/5 h-full px-2 py-3">
      {selectedUser && (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {selectedUser.logo ? (
                <img
                  src={selectedUser.logo}
                  className="w-[30px] h-[30px] bg-white rounded-full"
                />
              ) : (
                <Avatar
                  className="rounded-full"
                  width="30px"
                  height="30px"
                  title={selectedUser.username}
                />
              )}
              <p className="font-semibold text-lg text-center ml-2">
                {selectedUser.username}
              </p>
            </div>
            <div className="cursor-pointer" onClick={onClose}>
              <Image src="/assets/messages/close.svg" width={27} height={27} />
            </div>
          </div>

          <p className="font-semibold text-sm mt-5 mb-3">Username</p>
          <p className="text-gray text-sm my-3">@{selectedUser.username}</p>

          <p className="font-semibold text-sm my-3">Bio</p>
          <p className="text-gray text-sm my-3">I like talk shows</p>

          <div className="my-5 flex justify-between items-center">
            <p className="font-semibold text-md">Notifications</p>
            <Switch
              onChange={() => setChecked(!checked)}
              checked={checked}
              checkedIcon={false}
              uncheckedIcon={false}
              handleDiameter={15}
              offColor="#7E38B7"
              onColor="#7E38B7"
              width={38}
              height={20}
            />
          </div>
          <p className="text-sm my-3 text-purple">Block User</p>
          <p className="text-sm my-3 text-purple">Clear History</p>
          <p className="text-sm my-3 text-purple">Delete Conversation</p>
        </>
      )}
    </div>
  )
}

export default UserDetails
