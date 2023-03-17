import Image from 'next/image'
import Avatar from '../avatar'

type Props = {
  text: string
  profilePicture?: boolean
  file: Blob
  setFile: (file: File) => void
  id: string
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
  id,
  accept = '*',
  src,
  user = null,
  editProfile = false,
}: Props) => {
  return (
    <>
      <input
        type="file"
        accept={accept}
        id={id}
        hidden
        onChange={(e) => {
          setFile(e.target.files[0])
        }}
        className=""
      />
      <label htmlFor={id} className="w-full">
        <div className="cursor-pointer mx-auto flex flex-col items-center bg-transparent p-4 border border-black/40 border-dashed rounded-md transition-all hover:bg-[#D9D9D9]/10 pt-[86px]">
          <div className="flex justify-center">
            {src != '' &&
            !(
              file == null ||
              file == undefined ||
              typeof file == 'undefined'
            ) ? (
              <img
                className="mx-auto mt-auto h-40 w-40 rounded-full object-cover"
                src={src}
              />
            ) : editProfile ? (
              <Avatar
                className="rounded-full"
                width="150px"
                height="150px"
                title={user}
              />
            ) : null}
          </div>

          {!editProfile &&
          (file == null || file == undefined || typeof file == 'undefined') ? (
            <div className="w-fit rounded-full">
              <Image src="/assets/cloud.svg" width={44} height={35} />
            </div>
          ) : null}

          <p className="mb-auto text-center text-black">
            {file == null || file == undefined || typeof file == 'undefined'
              ? text
              : file.name}
          </p>
          <p className="text-[12px] text-gray leading-[18px] text-center mt-1">
            Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
          </p>
        </div>
      </label>
    </>
  )
}

export default FileUpload
