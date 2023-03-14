import Image from "next/image";
import { useRouter } from "next/router";
import Avatar from "../avatar";

type Props = {
  id: string | number;
  title: string;
  description: string;
  imgURL: string;
  status: string;
};

const DiscoverList = ({ id, title, description, imgURL, status }: Props) => {
  const router = useRouter();

  let statusStyle;
  if (status) {
    statusStyle = {
      marginTop: description.length > 195 ? "5px" : "45px",
      backgroundColor:
        status === "Looking to give client for commission."
          ? "#4b5e6d"
          : "#c2cfd8",
      textColor:
        status === "Looking to give client for commission." ? "white" : "black",
      textMarginBottom: description.length > 195 ? "1px" : "",
    };
  }

  return (
    <div className="flex flex-row w-full h-48 shadow-lg bg-white rounded justify-between gap-2">
      <div className="w-60 relative m-3 rounded-sm shrink-0">
        {imgURL ? (
          <Image
            layout="fill"
            objectFit="cover"
            className="rounded"
            src={imgURL}
          />
        ) : (
          <Avatar title={title} />
        )}
      </div>
      <div className="w-full h-full overflow-y-clip flex flex-col py-3">
        <p className="text-xl font-bold mt-4">{title}</p>
        <p className="text-sm flex-1 h-full">
          {description.length > 195
            ? description.slice(0, 195) + "..."
            : description}
        </p>
        <div className="text-sm">
          {status ? (
            <div
              className="rounded py-3 px-6 w-fit"
              style={{
                backgroundColor: statusStyle.backgroundColor,
              }}
            >
              <p
                style={{
                  color: statusStyle.textColor,
                  marginBottom: statusStyle.textMarginBottom,
                }}
              >{`Status: ${status}`}</p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="w-60 shrink-0 flex flex-col justify-center items-center gap-3 m-5">
        <button
          className="text-sm font-normal bg-[#006494] font-[Poppins]"
          onClick={() => router.push(`/app/profile/${id}`)}
        >
          View Profile
        </button>

        <button
          className="text-sm font-normal bg-[#061A40] font-[Poppins]"
          onClick={() => router.push(`/app/messages?newUser=${id}`)}
        >
          Start a chat
        </button>
      </div>
    </div>
  );
};

export default DiscoverList;
