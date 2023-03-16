import Image from 'next/image'
import Link from 'next/link'

type Props = {
  isSignUp?: boolean
}
const OnboardingSidebar = ({ isSignUp }: Props) => {
  return (
    <div
      className={`relative flex min-w-[550px] w-5/12 h-fill bg-[url('/assets/journey.svg')] bg-no-repeat bg-center bg-cover flex flex-col p-[60px] mr-0 gap-[90px] relative z-[5]
      ${isSignUp ? 'justify-end' : 'justify-start'}`}
    >
      <Link href="https://www.connective-app.xyz">
        <div className="absolute flex top-[35px] left-[50px] cursor-pointer items-center gap-[12px]">
          <Image
            className="w-[70px] h-[75px]"
            src="/assets/logo-1.svg"
            alt="Connective logo"
            width={36}
            height={36}
            priority
          />
          <h4 className="text-white text-[28px] font-[Poppins] font-[100]">
            Connective
          </h4>
        </div>
      </Link>
      {!isSignUp && (
        <div className="z-[1] bg-[#fff2f2]/[0.13] px-[40px] py-[24px] w-fit mt-44 backdrop-blur-[35.5px] mix-blend-normal rounded-2xl">
          <h1 className="max-w-[480px] font-[Montserrat] text-[#F2F4F5] font-bold text-[40px] leading-[52px] mb-[24px]">
            Register as a <br /> Company or Individual
          </h1>
          <p className="max-w-[480px] font-[Montserrat] text-[#F2F4F5] font-light text-[18px] leading-[150%]">
            And enjoy all the benefits that only Connective offers you.
          </p>
        </div>
      )}
      {isSignUp && (
        <div className="z-[1] bg-[#fff2f2]/[0.13] px-[40px] py-[24px] w-fit mx-auto mb-20 backdrop-blur-[35.5px] mix-blend-normal rounded-2xl">
          <h1 className="max-w-[363px] font-[Montserrat] text-[#F2F4F5] font-bold text-[40px] leading-[52px] mb-[24px]">
            Start your journey with us
          </h1>
          <p className="max-w-[465px] font-[Montserrat] text-[#F2F4F5] font-light text-[18px] leading-[150%]">
            Create your account and get instant access to the platform and
            everything that only Connective offers.
          </p>
        </div>
      )}
    </div>
  )
}

export default OnboardingSidebar
