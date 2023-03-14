import { MouseEventHandler } from "react";

type Props = {
  color: string;
  hoverColor: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

const ButtonRounded = ({ color, hoverColor, onClick, children }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[${color}] shadow-md px-10 py-2 rounded-full cursor-pointer transition-all hover:bg-[${hoverColor}] hover:shadow-lg`}
    >
      {children}
    </button>
  );
};

export default ButtonRounded;
