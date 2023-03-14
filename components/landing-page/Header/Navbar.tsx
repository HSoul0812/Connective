import Image from "next/image";
import Link from "next/link";
import ButtonDark from "../UI/ButtonDark";

const Navbar = () => {
  return (
    <nav className="max-w-[2000px] flex font-[Poppins] items-center justify-around  h-[76px] mx-auto px-[1.8rem]">
      <Image
        src="/assets/landing-page/logo.svg"
        alt="Connective Logo"
        width="148px"
        height="27px"
        priority
      />

      <div className="flex items-center gap-12 text-xs font-semibold 2bp:gap-6 navbar-items">
        <Link href=".">Home</Link>
        <Link href="/#offers">How it Work?</Link>
        <Link href="/#services">Services</Link>
        <Link href="/#contact">Contact</Link>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="https://calendly.com/connective-app/30min?month=2022-11"
          target="_blank"
        >
          <ButtonDark
            src="schedule-icon.svg"
            alt="Schedule"
            text="Schedule a Call"
          />
        </a>

        <a
          href="https://join.slack.com/t/connective-app/shared_invite/zt-1j40vh5y8-CBdGdfI_8syA8TI81ZaAMQ"
          target="_blank"
        >
          <ButtonDark src="slack-icon.svg" alt="Slack" text="Join Our Slack" />
        </a>

        <Link href="/auth/signin">
          <div className="w-fit flex items-center gap-2.5 bg-white py-2.5 px-4 rounded-[50px] cursor-pointer">
            <Image
              src="/assets/landing-page/account-icon.svg"
              alt="Account"
              width="20px"
              height="20px"
            />
            <p className="text-xs font-semibold text-[#061A40]">Account</p>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
