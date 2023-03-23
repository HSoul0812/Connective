import { ChangeEvent, useState, useRef, useEffect } from 'react'
import Util from 'util/index'
import Image from 'next/image'

const FileUploadEdit = ({ show, onClose, data, onSubmit }) => {
  const ref = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File>()
  const [src, setSrc] = useState<string>()
  const [isDeleted, setDeleted] = useState<boolean>(false)
  const [clickDelete, setClickDelete] = useState<boolean>(false)
  const [clickUpload, setClickUpload] = useState<boolean>(false)

  useEffect(() => {
    setSrc(data?.logo || data?.profile_picture)
  }, [data])

  const handleClick = () => {
    if (!src) {
      ref.current?.click()
    }
  }

  const handleUploadNew = () => {
    ref.current?.click()
  }
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    setDeleted(false)
    setClickUpload(true)
    setFile(e.target.files[0])
    setSrc(URL.createObjectURL(e.target.files[0]))
  }

  const handleUpload = async () => {
    console.log('handleUpload')
    let uploadUrl = await Util.uploadFile(data.user_id + '-pfp', file)
    console.log('handleUpload sucess')
    onSubmit(uploadUrl + '?' + new Date().getTime())
  }

  const handleDelete = () => {
    setSrc(null)
    setClickDelete(false)
    setDeleted(true)
  }

  const handleClose = () => {
    setFile(null)
    setSrc(data?.logo || data?.profile_picture)
    setDeleted(false)
    setClickDelete(false)
    setClickUpload(false)
    onClose()
  }

  return (
    <div className="font-[Poppins]">
      <input
        type="file"
        ref={ref}
        onChange={handleFileChange}
        className="hidden"
      />
      {show && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-[#0b0b0b]/[0.4] backdrop-blur-[8.5px]"
            onClick={handleClose}
          ></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-[984px] max-w-3xl py-4 mx-auto rounded-xl bg-[#f5f5f5]">
              <div className="mt-3">
                <div className="mt-2 text-center sm:ml-4 sm:text-left">
                  <h1 className="text-[40px] font-bold leading-[60px] text-black">
                    {clickDelete
                      ? 'Delete Profile photo'
                      : 'Edit Profile Picture'}
                  </h1>
                  <div
                    className="w-[215px] h-[215px] bg-gray/[0.2] mx-auto mt-5 flex items-center justify-center flex-col rounded-full cursor-pointer"
                    onClick={handleClick}
                  >
                    {src !== undefined && src && !isDeleted ? (
                      <img
                        src={src}
                        className="rounded-full w-full h-full"
                        loading="eager"
                      />
                    ) : (
                      <>
                        <Image
                          src="/assets/camera.svg"
                          width={40}
                          height={40}
                        />
                        <div className="text-[20px] listing-[30px] text-black">
                          Upload photo
                        </div>
                      </>
                    )}
                  </div>
                  <div className="h-[1px] bg-gray/[0.2] w-full mt-20"></div>

                  {clickUpload ? (
                    <div className="flex items-center justify-between mt-4 mx-4">
                      <div className="flex gap-2">
                        <button
                          className="w-[206px] bg-purple font-[400] text-white rounded-full text-[20px] listing-[30px] py-[9px] px-[33px]"
                          onClick={handleUpload}
                        >
                          Save Changes
                        </button>
                        <button
                          className="w-[206px] border !border-purple font-[400] bg-transparent text-black rounded-full text-[20px] listing-[30px] py-[9px] px-[33px]"
                          onClick={handleUploadNew}
                        >
                          Upload New
                        </button>
                      </div>
                      <button
                        className="w-[240px] border border-purple font-[400] bg-transparent text-black rounded-full text-[20px] listing-[30px] py-[9px] px-[33px]"
                        onClick={handleClose}
                      >
                        Discard Changes
                      </button>
                    </div>
                  ) : !clickDelete ? (
                    <button
                      onClick={() => setClickDelete(true)}
                      className="my-[30px] cursor-pointer w-fit mx-auto bg-transparent border !border-purple flex items-center justify-center text-black font-[400] rounded-full px-[25px] py-[9px]"
                      disabled={!src}
                    >
                      <Image
                        src="/assets/profile/trash.svg"
                        width={30}
                        height={30}
                      />
                      Delete Photo
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <button
                        className="max-w-[160px] bg-purple font-[400] text-white rounded-full text-[20px] listing-[30px] py-[9px]"
                        onClick={handleDelete}
                      >
                        Delete Photo
                      </button>
                      <button
                        className="max-w-[160px] border border-purple font-[400] bg-transparent text-black rounded-full text-[20px] listing-[30px] py-[9px]"
                        onClick={() => setClickDelete(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploadEdit
