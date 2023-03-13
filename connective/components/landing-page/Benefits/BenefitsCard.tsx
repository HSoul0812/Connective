import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  text: string;
};

const BenefitsCard = ({ src, alt, text }: Props) => {
  return (
    <div className="flex flex-col justify-center gap-4 font-[Poppins] max-w-[180px]">
      <Image
        src={`/assets/landing-page/${src}`}
        alt={`${alt}`}
        width="60px"
        height="60px"
      />

      <p className="font-semibold text-base text-center text-[#006494]">{`${text}`}</p>
    </div>
  );
};

export default BenefitsCard;
