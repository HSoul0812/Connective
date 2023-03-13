import Image from "next/image";
import bgImg from "../../public/assets/Right.png";

const LoginSidebar = () => {
  return (
    <div className="relative min-w-[620px] my-[32px] mr-[32px] 2bp:min-w-fit !max-h-[calc(100vh-64px)]">
      <Image
        className="w-fit rounded-[16px] min-h-0 min-w-0 !max-h-[100vw] max-w-0 z-[-5] signin-image"
        src={bgImg}
        alt="bg"
        priority
      />

      {/* <div  className="absolute bottom-0 px-[60px] mb-[208px] z-[20] top-0">
        <h1  className="max-w-[403px] font-[Montserrat] text-[#F2F4F5] font-bold text-[40px] leading-[49px] mb-[24px] 1bp:text-[54px] 1bp:leading-[59px]">
          Curated B2B Assets Monetized
        </h1>
        <p  className="max-w-[454px] font-[Montserrat] text-[#F2F4F5] font-light text-[20px] leading-[150%] 1bp:text-[24px]">
          Connective is an open marketplace designed for businesses to help each
          other grow through buying and selling digital assets.
        </p>
      </div> */}
    </div>
  );
};

export default LoginSidebar;
