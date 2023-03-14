import Image from "next/image";

const OnBoardingProfile = () => {
  return (
    <div className="min-w-[550px] h-[100vh] bg-gradient-to-b from-[#061A40] to-[#0C3A65] flex flex-col m-[32px] mr-0 rounded-[16px] gap-[90px] relative z-[5]">
      <Image
        className="w-fit h-fit rounded-[16px]"
        src="/assets/left.png"
        layout="fill"
        objectFit="cover"
        priority
      />

      {/* <div  className="absolute z-[10] p-[60px] mt-[167px]">
        <h1  className="max-w-[363px] font-[Montserrat] text-[#F2F4F5] font-bold text-[40px] leading-[49px] mb-[24px]">
          Register as a company or individual
        </h1>
        <p  className="max-w-[306px] font-[Montserrat] text-[#F2F4F5] font-light text-[20px] leading-[150%]">
          And enjoy all the benefits that only Connective offers you
        </p>
      </div> */}
    </div>
  );
};

export default OnBoardingProfile;
