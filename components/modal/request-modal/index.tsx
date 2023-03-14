import Image from "next/image";
import closeIcon from "../../../public/assets/close.svg";
import axios from "axios";
import { MouseEventHandler, useState } from "react";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  close: () => void;
};

const RequestModal = ({ onClick, close }: Props) => {
  const [topic, setTopic] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const submit = async () => {
    await axios.post("/api/lists/requests-list", { topic, description });
    close();
  };

  return (
    <div className="absolute top-0 left-0 z-10 bg-[#000000]/30 backdrop-blur-sm w-full h-full flex">
      <div className="mx-auto my-auto w-[480px] h-[389px] p-[32px] rounded-lg bg-white">
        <div className="border-b-[1px] border-b-[#E0E0E0] pb-[24px] mb-[24px] flex flex-row justify-between items-center">
          <p className="font-[Poppins] font-bold text-[24px] leading-[29px] text-[#0D1011]">
            Submit your request
          </p>
          <Image
            className="cursor-pointer"
            src={closeIcon}
            alt="close"
            width="20px"
            height="20px"
            onClick={close}
          />
        </div>
        <input
          className="w-[416px] h-[46px] border-[1px] border-[#0D1011]/[.15] rounded-lg pl-[14px] mb-[24px]"
          type="text"
          placeholder="List Topic"
          onChange={(e) => {
            setTopic(e.target.value);
          }}
        />
        <textarea
          className="w-[416px] max-h-[120px] h-[120px] border-[1px] border-[#0D1011]/[.15] rounded-lg pl-[14px] mb-[26px]"
          placeholder="List Description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <button
          className="w-full h-[39px] text-center bg-[#061A40] text-white font-[Poppins] font-medium text-[14px] leading-[17px]"
          onClick={submit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RequestModal;
