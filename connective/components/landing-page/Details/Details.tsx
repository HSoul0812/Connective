import Image from "next/image";
import DetailsCard from "./DetailsCard";

const Details = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#061A40] to-[#0C3A65] font-[Poppins] text-white py-20 mx-auto px-[1.8rem]">
      <h2 className="text-center text-4xl font-bold text-white mb-14">
        What can be considered a digital asset? Why sell it?
      </h2>

      <div className="max-w-[800px] mx-auto">
        <div className="flex items-center justify-center gap-16 mb-14">
          <DetailsCard
            src="network-icon.svg"
            alt="Network"
            title="Curated Network"
            text="Sell your personal network and earn passive income."
          />
          <DetailsCard
            src="referral-icon.svg"
            alt="Referral"
            title="Curated Referral Partners"
            text="Sell a list of Referral partners and earn more business."
          />
          <DetailsCard
            src="affiliate-icon.svg"
            alt="Affiliate"
            title="Curated Affiliate Partners"
            text="Sell a list of Affiliate partners and build a stronger sales pipeline."
          />
        </div>

        <div className="flex items-center justify-center gap-16">
          <DetailsCard
            src="industry-icon.svg"
            alt="Industry"
            title="Curated Industry Data"
            text="Sell your Industry expertise for a price. Your experience has a dollar value."
          />
          <DetailsCard
            src="lessons-icon.svg"
            alt="Lessons Learned"
            title="Curated Lessons Learned"
            text="Sell your lessons learned for a passive income and help upcoming businesses."
          />
          <DetailsCard
            src="reviews-icon.svg"
            alt="Reviews"
            title="Curated Reviews"
            text="Sell your reviews to help the buyer make decisions."
          />
        </div>
      </div>

      <div className="absolute flex gap-4 left-[23px] top-0 bottom-0">
        <Image
          src="/assets/landing-page/vectors.svg"
          alt="Vector"
          width="16.91px"
          height="153.31px"
        />
        <Image
          src="/assets/landing-page/vectors.svg"
          alt="Vector"
          width="16.91px"
          height="153.31px"
        />
        <Image
          src="/assets/landing-page/vectors.svg"
          alt="Vector"
          width="16.91px"
          height="153.31px"
        />
      </div>

      <div className="absolute flex gap-4 right-0 bottom-0">
        <Image
          src="/assets/landing-page/vectors-2.svg"
          alt="Vector"
          width="117.95px"
          height="139.93px"
        />
      </div>
    </section>
  );
};

export default Details;
