import Image from "next/image";

const Offers = () => {
  return (
    <section
      id="offers"
      className="bg-white font-[Poppins] py-20 max-w-[978px] mx-auto"
    >
      <h2 className="text-center text-4xl font-bold text-[#061A40] mb-10">
        What Connective offers
      </h2>

      <div className="flex items-center justify-between">
        <div>
          <div className="mb-8 max-w-[430px]">
            <h3 className="font-bold text-3xl text-[#006494] mb-4">
              For Sellers
            </h3>
            <p className="font-normal text-base text-[#061A40]">
              Connective enables businesses to sell their{" "}
              <span className="font-bold">
                Network, Affiliate Partners, Experience,
              </span>{" "}
              as digital assets to other businesses.
            </p>
          </div>
          <div className="max-w-[430px]">
            <h3 className="font-bold text-3xl text-[#006494] mb-4">
              For Buyers
            </h3>
            <p className="font-normal text-base text-[#061A40]">
              Connective enables businesses to{" "}
              <span className="font-bold">Save Time, Resources,</span> and{" "}
              <span className="font-bold">Energy</span> in research, networking,
              & validated learning by providing them with a platform where other
              businesses sell these assets for a dollar value.
            </p>
          </div>
        </div>

        <div className="relative w-[367px] h-[333px]">
          <Image
            className="rounded-full z-[10]"
            src="/assets/landing-page/offers-pic.png"
            alt="Offers"
            width="306px"
            height="307px"
            objectFit="cover"
            priority
          />
          <div className="absolute w-fit left-[214px] top-[180px] z-[20]">
            <Image
              className="rounded-full"
              src="/assets/landing-page/offers-cards.jpg"
              alt="Offers"
              width="163px"
              height="163px"
              objectFit="cover"
              priority
            />
          </div>
          <div className="absolute w-fit left-[200px] top-[4px] z-[5]">
            <Image
              className="rounded-full"
              src="/assets/landing-page/offers-vector.svg"
              alt="Offers"
              width="184px"
              height="160px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
