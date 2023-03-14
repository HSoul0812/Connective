import Image from "next/image";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#061A40] to-[#0C3A65] font-[Poppins] text-white py-20 mx-auto px-[1.8rem]">
      <h2 className="text-center text-4xl font-bold text-white mb-14">
        Ready to get started?
      </h2>

      <div className="flex items-center justify-center gap-4 mx-auto">
        <Link href="/auth/signup">
          <div className="w-fit flex items-center gap-2.5 border border-white bg-white py-2 px-6 rounded-[50px] cursor-pointer">
            <p className="text-xl font-semibold text-[#061A40]">Get Started</p>
          </div>
        </Link>

        <a
          href="https://calendly.com/connective-app/30min?month=2022-11"
          target="_blank"
        >
          <div className="w-fit flex items-center gap-2.5 border border-[white] py-2 px-6 rounded-[50px] cursor-pointer hover:bg-white/[.10]">
            <Image
              src="/assets/landing-page/schedule-icon.svg"
              alt="Schedule"
              width="20px"
              height="20px"
            />
            <p className="text-xl font-semibold">Schedule a Call</p>
          </div>
        </a>
      </div>

      <div className="absolute flex flex-col gap-2.5 left-[-43px] top-[74px]">
        <Image
          src="/assets/landing-page/cta-vectors.svg"
          alt="Vectors"
          width="209px"
          height="65.8px"
        />
      </div>

      <div className="absolute flex gap-4 right-0 bottom-[23px]">
        <Image
          src="/assets/landing-page/cta-vectors2.svg"
          alt="Vectors"
          width="112.9px"
          height="133.19px"
        />
      </div>
    </section>
  );
};

export default CTA;
