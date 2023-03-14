import { MouseEventHandler } from "react";

type Props = {
  text: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className: string;
};

const ButtonLight = ({ text, onClick = () => {}, className }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer font-bold bg-white h-fit text-[#061A40] flex flex-row py-[8px] w-fit border-[1px] border-[#061A40] rounded-lg transition-all ${className}`}
    >
      <p className="mx-auto">{text}</p>
    </div>
  );
};

export default ButtonLight;
