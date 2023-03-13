import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#061A40] font-[Poppins] text-[#F2F4F5] mx-auto">
      <div className="flex items-start justify-between py-8 px-16">
        <Image
          src="/assets/landing-page/logo-footer.svg"
          alt="Connective logo"
          width="278px"
          height="75px"
        />

        <div className="flex gap-32">
          <div className="text-base flex flex-col gap-3.5">
            <h3 className="font-bold">Links</h3>
            <div className="flex flex-col gap-2">
              <Link href=".">Home</Link>
              <Link href="/#offers">How It Works</Link>
              <Link href="/#services">Services</Link>
            </div>
          </div>

          <div className="text-base flex flex-col gap-3.5">
            <h3 className="font-bold">Contact</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://calendly.com/connective-app/30min?month=2022-11"
                target="_blank"
              >
                Schedule a Call
              </a>
              <a
                href="https://join.slack.com/t/connective-app/shared_invite/zt-1j40vh5y8-CBdGdfI_8syA8TI81ZaAMQ"
                target="_blank"
              >
                Join Our Slack
              </a>
              <Link href="/#contact">Contact</Link>
            </div>
          </div>

          <div className="text-base flex flex-col gap-3.5">
            <h3 className="font-bold">Account</h3>
            <div className="flex flex-col gap-2">
              <Link href="/auth/signin">Sign In</Link>
              <Link href="/auth/signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[42px] border-t-[0.5px] border-t-[#f2f4f54d] py-3 px-16">
        <p className="text-xs text-[#F2F4F5]">Property Of Wanderlust LLC</p>
      </div>
    </footer>
  );
};

export default Footer;
