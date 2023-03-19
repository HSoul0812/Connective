import { useRef, useState } from 'react'
import Image from 'next/image'
import Avatar from '../avatar'

type Props = {
  text: string
  profilePicture?: boolean
  file: Blob
  setFile: (file: File) => void
  accept?: string
  src: string
  user?: string
  editProfile?: boolean
}

const FileUpload = ({
  text,
  profilePicture = false,
  file,
  setFile,
  accept = '*',
  src,
  user = null,
  editProfile = false,
}: Props) => {
  const ref = useRef<HTMLInputElement>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const handleClick = () => {
    ref.current.click()
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const handleChange = (e) => {
    setFile(e.target.files[0])
    setShowModal(false)
  }

  return (
    <>
      <label className="w-full" onClick={() => setShowModal(true)}>
        <div className="cursor-pointer mx-auto flex flex-col items-center bg-transparent p-4 border border-black/40 border-dashed rounded-md transition-all hover:bg-[#D9D9D9]/10 pt-[86px]">
          <div className="flex justify-center">
            {src == '' && !file ? (
              <Avatar
                className="rounded-full"
                width={130}
                height={130}
                title={user}
              />
            ) : (
              <img
                className="mx-auto mt-auto h-[130px] w-[130px] rounded-full object-cover"
                src={src}
              />
            )}
          </div>

          {!editProfile &&
          (file == null || file == undefined || typeof file == 'undefined') ? (
            <div className="w-fit rounded-full">
              <Image src="/assets/cloud.svg" width={44} height={35} />
            </div>
          ) : null}
          {file ? (
            <div className="text-purple text-[14px] listing-[24px] mt-3">
              Change Profile Photo
            </div>
          ) : (
            <>
              <p className="mb-auto text-center text-black">
                {file == null || file == undefined || typeof file == 'undefined'
                  ? text
                  : file.name}
              </p>
              <p className="text-[12px] text-gray leading-[18px] text-center mt-1">
                Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
              </p>
            </>
          )}
        </div>
      </label>
      <input
        type="file"
        accept={accept}
        ref={ref}
        hidden
        onChange={(e) => handleChange(e)}
        className=""
      />
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-[#0b0b0b]/[0.4] backdrop-blur-[8.5px]"
            onClick={handleClose}
          ></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full w-[984px] max-w-3xl py-4 mx-auto rounded-xl bg-[#f5f5f5]">
              <div className="mt-3">
                <div className="mt-2 text-center sm:ml-4 sm:text-left">
                  <h1 className="text-[40px] font-bold font-[Poppins] leading-[60px] text-black">
                    Upload Profile Picture
                  </h1>
                  <div
                    className="w-[215px] h-[215px] bg-gray/[0.2] mx-auto mt-5 flex items-center justify-center flex-col rounded-full cursor-pointer"
                    onClick={handleClick}
                  >
                    <Image src="/assets/camera.svg" width={40} height={40} />
                    <div className="text-[20px] listing-[30px] text-black">
                      Upload photo
                    </div>
                  </div>
                  <div className="h-[1px] bg-gray/[0.2] w-full mt-20"></div>
                  <button
                    // onClick={() => setFile(undefined)}
                    className="my-[30px] w-fit mx-auto bg-transparent border borders-gray flex items-center justify-center text-gray/[0.8] rounded-full px-[30px]"
                  >
                    <Image src="/assets/trash.svg" width={30} height={30} />
                    Delete Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FileUpload
