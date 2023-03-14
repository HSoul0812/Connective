import Avatar from '../../avatar'

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

export default UserDetails
