import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  text: string;
};

const ButtonDark = ({ src, alt, text }: Props) => {
  return (
    <div className="w-fit flex items-center gap-2.5 border border-[white] py-2.5 px-4 rounded-[50px] cursor-pointer hover:bg-white/[.10]">
      <Image
        src={`/assets/landing-page/${src}`}
        alt={`${alt}`}
        width="20px"
        height="20px"
      />
      <p className="text-xs font-semibold">{text}</p>
    </div>
  );
};

export default ButtonDark;
