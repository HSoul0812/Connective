import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { AccountType } from "../../../types/types";

type Props = {
  type: AccountType;
  setType: Dispatch<SetStateAction<AccountType>>;
};

const ProfileTypeSelector = ({ type, setType }: Props) => {
  let unselectedClass =
    "font-[Montserrat] cursor-pointer text-black bg-white flex flex-row gap-2 px-10 py-2 border-2 border-black h-[47px] flex items-center justify-center rounded-lg border-[1px] border-[#0F172A] w-fill flex flex-row items-center justify-center";
  let selectedClass =
    "font-[Montserrat] cursor-pointer bg-[#0F172A] text-white flex flex-row gap-2 px-10 py-2 border-2 border-black/50 h-[47px] flex items-center justify-center rounded-lg border-[1px] border-[#0F172A] w-fill flex flex-row items-center justify-center";

  return (
    <div className="flex flex-row gap-5 mx-auto">
      <div className="w-[229px] rounded-lg">
        <div
          onClick={() => {
            setType(AccountType.BUSINESS);
          }}
          className={
            type == AccountType.BUSINESS ? selectedClass : unselectedClass
          }
        >
          <div className="h-fit mt-[5px]">
            {type == AccountType.BUSINESS ? (
              <Image
                src="/assets/business-white.svg"
                alt="Connective logo"
                width="20px"
                height="20px"
              />
            ) : (
              <Image
                src="/assets/business.svg"
                alt="Connective logo"
                width="20px"
                height="20px"
              />
            )}
          </div>
          <p className="font-bold text-[12px] leading-[15px]">
            I am a business
          </p>
        </div>
      </div>

      <div className="w-[229px] rounded-lg">
        <div
          onClick={() => {
            setType(AccountType.INDIVIDUAL);
          }}
          className={
            type == AccountType.INDIVIDUAL ? selectedClass : unselectedClass
          }
        >
          <div className="h-fit mt-[5px]">
            {type == AccountType.INDIVIDUAL ? (
              <Image
                src="/assets/person-white.svg"
                alt="Connective logo"
                width="20px"
                height="20px"
              />
            ) : (
              <Image
                src="/assets/person.svg"
                alt="Connective logo"
                width="20px"
                height="20px"
              />
            )}
          </div>
          <p className="font-bold text-[12px] leading-[15px]">
            I am an Individual
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTypeSelector;

{
  /* <div  className="flex flex-row gap-[10px]">
    <Image src={person} alt="Individual" width="16.67px" height="15px" />
    <p  className="font-bold text-[12px] leading-[15px]">
      I am an Individual
    </p>
  </div> */
}
