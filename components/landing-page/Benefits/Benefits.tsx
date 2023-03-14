import BenefitsCard from "./BenefitsCard";

const Benefits = () => {
  return (
    <section
      id="services"
      className="bg-white font-[Poppins] py-20 mx-auto px-[1.8rem]"
    >
      <h2 className="text-center text-4xl font-bold text-[#061A40] mb-6">
        Why buy data from other bussinesses?
      </h2>

      <p className="max-w-[669px] font-normal text-[#061A40] text-lg text-center mx-auto mb-12">
        Our mentality is{" "}
        <span className="font-bold">
          "One man's trash is another man's come up."
        </span>{" "}
        In this case, it is not trash but a pot of gold at the end of the
        rainbow basket. By using Connective, a business can:
      </p>

      <div className="flex justify-between max-w-[640px] mx-auto">
        <BenefitsCard
          src="network-time.svg"
          alt="Network"
          text="Save time in building a network"
        />
        <BenefitsCard
          src="research-time.svg"
          alt="Research"
          text="Save time researching"
        />
        <BenefitsCard
          src="exp-time.svg"
          alt="Experimenting"
          text="Save time from experimenting"
        />
      </div>
    </section>
  );
};

export default Benefits;
