import Image from "next/image";
import Link from "next/link";

const OnboardingSidebar = () => {
  return (
    <div className="min-w-[550px] h-fill bg-gradient-to-b from-[#061A40] to-[#0C3A65] flex flex-col p-[60px] m-[32px] mr-0 rounded-[16px] gap-[90px] relative z-[5]">
      <Link href="https://www.connective-app.xyz">
        <div className="flex flex-row cursor-pointer items-center gap-[12px]">
          <Image
            className="w-[70px] h-[75px]"
            src="/assets/logo-1.svg"
            width="70px"
            height="75px"
            priority
          />
          <Image
            className="w-[196px] h-[36px]"
            src="/assets/logo-2.svg"
            width="196px"
            height="36px"
            priority
          />
        </div>
      </Link>

      <div>
        <h1 className="max-w-[363px] font-[Montserrat] text-[#F2F4F5] font-bold text-[40px] leading-[49px] mb-[24px]">
          Start your journey with us
        </h1>
        <p className="max-w-[393px] font-[Montserrat] text-[#F2F4F5] font-light text-[20px] leading-[150%]">
          Create your account and get instant access to the platform and
          everything that only Connective offers.
        </p>
      </div>

      <div className="absolute z-[20] bottom-0 left-[-84px] pb-[24px]">
        <Image
          className="w-[243px] h-[249px]"
          src="/assets/doodles-left.svg"
          width="243px"
          height="249px"
        />
      </div>

      <div className="absolute z-[20] top-[-18px] right-[-47px] rounded-[500px]">
        <Image
          className="w-[135px] h-[138px]"
          src="/assets/doodles-right.svg"
          width="135px"
          height="138px"
        />
      </div>
    </div>
  );
};

export default OnboardingSidebar;
