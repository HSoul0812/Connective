import { MouseEventHandler } from "react";

type Props = {
  text: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  className: string;
};

const ButtonGreen = ({ text, onClick, className }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer font-bold bg-[#006494] h-fit text-white flex flex-row py-[12px] w-[200px] rounded-lg transition-all hover:bg-[#006494]/70 ${className}`}
    >
      <p className="mx-auto">{text}</p>
    </div>
  );
};

export default ButtonGreen;
