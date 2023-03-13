import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative flex justify-center mt-20 px-[1.8rem] z-[5]">
      <div className="w-[978px] font-[Poppins] text-white flex justify-between">
        <div className="max-w-[432px] h-fit mt-[90px]">
          <h1 className="font-bold text-5xl mb-5">
            Curated B2B Assets Monetized
          </h1>
          <p className="text-base mb-5">
            Connective is an open marketplace designed for businesses to help
            each other grow through buying and selling digital assets
          </p>
          <div className="flex items-center gap-4 mx-auto">
            <Link href="/auth/signup">
              <div className="w-fit flex items-center gap-2.5 border border-white bg-white py-2 px-4 rounded-[50px] cursor-pointer">
                <p className="text-xs font-semibold text-[#061A40]">
                  Get Started
                </p>
              </div>
            </Link>

            <a
              href="https://calendly.com/connective-app/30min?month=2022-11"
              target="_blank"
            >
              <div className="w-fit flex items-center gap-2.5 border border-[white] py-2 px-4 rounded-[50px] cursor-pointer hover:bg-white/[.10]">
                <Image
                  src="/assets/landing-page/schedule-icon.svg"
                  alt="Schedule"
                  width="15px"
                  height="15px"
                />
                <p className="text-xs font-semibold">Schedule a Call</p>
              </div>
            </a>
          </div>
        </div>

        <div className="w-[356px] h-[506px] z-[10] mr-[-75px] relative 2bp:mr-2">
          <Image
            className="w-fit h-fit"
            src="/assets/landing-page/hero-pic.svg"
            alt="Schedule"
            width="356px"
            height="506px"
            priority
          />
          <div className="w-[128.65px] h-[116.78px] absolute right-[275px] bottom-[297px] z-[-5]">
            <Image
              src="/assets/landing-page/hero-vector3.svg"
              alt="Vector"
              width="128.65px"
              height="116.78px"
            />
          </div>
        </div>
      </div>

      {/* Vectors */}
      <div className="absolute w-fit left-[19px] top-[40px]">
        <Image
          src="/assets/landing-page/hero-vector1.svg"
          alt="Vector"
          width="167.49px"
          height="120.61px"
        />
      </div>
      <div className="absolute w-fit left-[37px] bottom-[-25px]">
        <Image
          src="/assets/landing-page/hero-vector2.svg"
          alt="Vector"
          width="128.65px"
          height="116.78px"
        />
      </div>

      <div className="absolute w-fit right-0 bottom-[-246px]">
        <Image
          src="/assets/landing-page/hero-vector4.svg"
          alt="Vector"
          width="300.47px"
          height="583px"
        />
      </div>
    </section>
  );
};

export default Hero;
