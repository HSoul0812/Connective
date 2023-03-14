import Head from "next/head";
import Benefits from "../components/landing-page/Benefits/Benefits";
import ContactForm from "../components/landing-page/ContactForm.js/ContactForm";
import CTA from "../components/landing-page/CTA/CTA";
import Details from "../components/landing-page/Details/Details";
import Footer from "../components/landing-page/Footer/Footer";
import Hero from "../components/landing-page/Header/Hero";
import Navbar from "../components/landing-page/Header/Navbar";
import Offers from "../components/landing-page/Offers/Offers";
import { Recache } from "recache-client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    try {
      Recache.logEvent_AutodetectIp("landing");
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Connective</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gradient-to-b from-[#061A40] to-[#0C3A65] text-white h-fit">
        <Navbar />
        <Hero />
      </header>

      <main>
        <Offers />
        <Details />
        <Benefits />
        <CTA />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}

{
  /* <main  className="flex flex-col min-h-screen min-w-screen">
    <Logo></Logo>
    <div  className="mt-[20vh] px-[10vw] bg-[#F9F9F9] py-10 relative flex flex-row">
      <div  className="flex flex-col">
        <p  className="font-[ABeeZee] text-[6vh] text-[#0F172A]">
          Welcome to Connective
        </p>
        <p  className="text-subheading w-[30vw] text-black/50">
          Lörem ipsum content marketing Cecilia Ekström Adam Petersson
          branded och Elisabeth Olofsson. Adam Petersson branded Adam
          Petersson branded content boomer Göran Berglund. lorem ipsumAdam
          Petersson branded
        </p>
        <div  className="mt-10 flex flex-row gap-7">
          <ButtonRounded
            color="#0F172A"
            hoverColor="#1b253d"
            onClick={() => {
              router.push("/auth/signup");
            }}
          >
            <p  className="text-white">Sign up</p>
          </ButtonRounded>
          <ButtonRounded
            color="#EEEEED"
            hoverColor="#deded8"
            onClick={() => {
              router.push("/auth/signin");
            }}
          >
            <p  className="text-[#0F172A]">Sign in</p>
          </ButtonRounded>
        </div>
      </div>
      <img
          className="absolute right-[10vw]"
        src="./assets/hero-image.png"
      ></img>
    </div>
  </main> */
}
