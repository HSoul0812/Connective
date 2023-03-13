import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import closeIcon from "../../../public/assets/close.svg";
import starIcon from "../../../public/assets/star.svg";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const ReviewModal = ({ onClick }: Props) => {
  const [starChecked, setStarChecked] = useState<boolean>(false);

  const startCheckHandler = () => {
    setStarChecked((prevState) => !prevState);
  };

  return (
    <div className="overlay fixed left-0 top-0 bg-black/[.50] w-[100%] h-[100%] z-[30] flex justify-center items-center">
      <div className="w-[480px] h-[435px] p-[32px] rounded-lg bg-white">
        <div className="mb-[24px] flex flex-row justify-between items-center">
          <div />
          <Image
            className="cursor-pointer"
            src={closeIcon}
            alt="close"
            width="20px"
            height="20px"
          />
        </div>
        <p className="font-[Poppins] font-bold text-[24px] leading-[29px] text-[#0D1011] text-center mx-auto mb-[24px]">
          Leave your review
        </p>
        <div className="flex flex-row items-center justify-center mx-auto gap-1 cursor-pointer mb-[26px]">
          {/* --> #FFB703 */}
          <Image
            className="cursor-pointer"
            src={starIcon}
            alt="star"
            width="24px"
            height="24px"
            onClick={startCheckHandler}
          />
          <Image
            className="cursor-pointer"
            src={starIcon}
            alt="star"
            width="24px"
            height="24px"
            onClick={startCheckHandler}
          />
          <Image
            className="cursor-pointer"
            src={starIcon}
            alt="star"
            width="24px"
            height="24px"
            onClick={startCheckHandler}
          />
          <Image
            className="cursor-pointer"
            src={starIcon}
            alt="star"
            width="24px"
            height="24px"
            onClick={startCheckHandler}
          />
          <Image
            className="cursor-pointer"
            src={starIcon}
            alt="star"
            width="24px"
            height="24px"
            onClick={startCheckHandler}
          />
        </div>
        <textarea
          className="w-[416px] max-h-[160px] h-[160px] border-[1px] border-[#0D1011]/[.15] rounded-lg pl-[14px] mb-[26px]"
          placeholder="Leave your feedback"
        />
        <button
          className="w-full h-[39px] text-center bg-[#061A40] text-white font-[Poppins] font-medium text-[14px] leading-[17px]"
          onClick={onClick}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
