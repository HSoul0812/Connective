import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  title: string;
  text: string;
};

const DetailsCard = ({ src, alt, title, text }: Props) => {
  return (
    <div className="flex flex-col justify-center gap-4 font-[Poppins] max-w-[220px]">
      <Image
        src={`/assets/landing-page/${src}`}
        alt={`${alt}`}
        width="60px"
        height="60px"
      />

      <p className="font-bold text-base text-center text-[#F2F4F5]">{`${title}`}</p>

      <p className="font-normal text-center text-xs">{`${text}`}</p>
    </div>
  );
};

export default DetailsCard;
