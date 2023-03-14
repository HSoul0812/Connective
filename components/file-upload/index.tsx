import Avatar from "../avatar";

type Props = {
  text: string;
  profilePicture?: boolean;
  file: Blob;
  setFile: (file: File) => void;
  id: string;
  accept?: string;
  src: string;
  user?: string;
  editProfile?: boolean;
};

const FileUpload = ({
  text,
  profilePicture = false,
  file,
  setFile,
  id,
  accept = "*",
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
          setFile(e.target.files[0]);
        }}
        className=""
      />
      <label htmlFor={id} className="">
        <div className="cursor-pointer min-h-[131px] mx-auto flex flex-col bg-transparent p-5 border border-black/40 border-dashed rounded-md transition-all hover:bg-[#D9D9D9]/10 pt-[86px]">
          <div className="flex justify-center">
            {src != "" &&
            !(
              file == null ||
              file == undefined ||
              typeof file == "undefined"
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
          (file == null || file == undefined || typeof file == "undefined") ? (
            <img
              className="relative  w-[44px] h-[35]"
              src="/assets/cloud.svg"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: "0.6",
              }}
            />
          ) : null}

          <p className="mb-auto text-center text-black/50">
            {file == null || file == undefined || typeof file == "undefined"
              ? text
              : file.name}
          </p>
        </div>
      </label>
    </>
  );
};

export default FileUpload;
