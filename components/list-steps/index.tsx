import { useRouter } from "next/router";

const Steps = () => {
  const router = useRouter();
  const currentRoute = router.pathname;

  const defStyles =
    "text-[#575757] w-[40px] h-[40px] bg-[#BFBFBF] flex justify-center items-center rounded-[50px]";
  const activeStepBg =
    "text-white w-[40px] h-[40px] flex justify-center items-center rounded-[50px] bg-[#061A40] text-white";

  return (
    <div className="mt-[64px] mx-auto flex flex-row items-baseline">
      <div className="flex flex-col items-center gap-[8px]">
        <div
          className={`${
            currentRoute === "/app/lists/create/1" ? activeStepBg : defStyles
          }`}
        >
          <p className="font-[Poppins] text-[20px]">1</p>
        </div>
        <p className="font-[Poppins] font-normal text-[12px] text-[#575757]">
          Upload
        </p>
      </div>

      <div
        className={`w-[80px] h-[2px] ${
          currentRoute === "/app/lists/create/1"
            ? "bg-[#061A40]"
            : "bg-[#BFBFBF]"
        }`}
      />

      <div className="flex flex-col items-center gap-[8px]">
        <div
          className={`${
            currentRoute === "/app/lists/create/2" ? activeStepBg : defStyles
          }`}
        >
          <p className="font-[Poppins] text-[20px]">2</p>
        </div>
        <p className="font-[Poppins] font-normal text-[12px] text-[#575757]">
          Details
        </p>
      </div>

      <div
        className={`w-[80px] h-[2px] ${
          currentRoute === "/app/lists/create/2"
            ? "bg-[#061A40]"
            : "bg-[#BFBFBF]"
        }`}
      />

      <div className="flex flex-col items-center gap-[8px]">
        <div
          className={`${
            currentRoute === "/app/lists/create/3" ? activeStepBg : defStyles
          }`}
        >
          <p className="font-[Poppins] text-[20px]">3</p>
        </div>
        <p className="font-[Poppins] font-normal text-[12px] text-[#575757]">
          Price
        </p>
      </div>

      <div
        className={`w-[80px] h-[2px] ${
          currentRoute === "/app/lists/create/3"
            ? "bg-[#061A40]"
            : "bg-[#BFBFBF]"
        }`}
      />

      <div className="flex flex-col items-center gap-[8px]">
        <div
          className={`${
            currentRoute === "/app/lists/create/4" ? activeStepBg : defStyles
          }`}
        >
          <p className="font-[Poppins] text-[20px]">4</p>
        </div>
        <p className="font-[Poppins] font-normal text-[12px] text-[#575757]">
          Preview
        </p>
      </div>
    </div>
  );
};

export default Steps;
