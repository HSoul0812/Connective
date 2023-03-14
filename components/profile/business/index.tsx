import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Avatar from "../../avatar";
import { User, Industry } from "../../../types/types";
import {
  IApiResponseError,
  ProfileApiResponse,
} from "../../../types/apiResponseTypes";

type Props = {
  user: User;
  industries: Industry[];
  id: number;
};

export default function BusinessProfile({ user, industries, id }: Props) {
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [industry, setIndustry] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (typeof window != "undefined" && typeof user == "undefined") {
      router.push("/auth/signin");
    }
  }, [user]);

  const getProfile = async () => {
    try {
      await axios.get(`/api/profiles/business?id=${id}`).then((res) => {
        let data: ProfileApiResponse.IBusiness | IApiResponseError = res.data;
        if (data.type == "IApiResponseError") {
          throw data;
        } else {
          setData(data.business);
          setLoaded(true);
          const selectedIndustry = industries.find(
            (industry) =>
              industry.id ==
              (data as ProfileApiResponse.IBusiness).business.industry
          );
          setIndustry(selectedIndustry.name);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col w-[100%] h-full p-[64px]">
      {loaded ? (
        <>
          <img
            className="h-[18vh] w-[100%] object-cover relative shadow-md rounded-[12px]"
            src="/assets/banners/waves-min.jpeg"
          />
          <div className="w-[100%] flex flex-row justify-between items-center mt-[-70px]">
            <div className="mb-[64px] flex flex-row items-center gap-[40px] pl-[50px]">
              {data?.logo == "" ? (
                <Avatar
                  width="150px"
                  height="150px"
                  title={data?.company_name}
                />
              ) : (
                <div className="w-[200px] h-[200px]">
                  <img
                    className="rounded-full w-[100%] h-[100%] z-10 backdrop-blur-sm bg-white/20 shadow-md object-cover"
                    src={data?.logo}
                  ></img>
                </div>
              )}

              <div className="flex flex-col mt-[80px]">
                <div className="flex flex-row">
                  <p className="font-bold text-2xl 2xl:text-4xl mb-1 text-[#0D1011]">
                    {data?.company_name}
                  </p>
                </div>

                <div className="flex flex-row gap-10 text-[14px] 2xl:text-xl mr-16 pb-5 font-[Poppins]">
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      className="h-[14px] w-[14px]"
                      src="/assets/location-pin.png"
                    />
                    <p>{data?.location}</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <img className="h-[14px] w-[14px]" src="/assets/link.png" />
                    <a
                      className="font-normal cursor-pointer text-[#061A40] underline-offset-0 font-[Poppins]"
                      href={
                        data?.website.includes("https")
                          ? data?.website
                          : "https://" + data?.website
                      }
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {user.id == id && (
              <div
                className="flex flex-row gap-[12px] cursor-pointer text-white rounded-lg bg-[#061A40] items-center py-[18px] px-[40px]"
                onClick={() => router.push("/app/profile/edit-profile")}
              >
                <img className="w-[20px] h-[20px]" src="/assets/edit.svg" />
                <p className="hover:scale-105 hover:shadow-lg font-[Poppins] text-center text-[14px]">
                  Edit Profile
                </p>
              </div>
            )}
          </div>

          {data.status ? (
            <div
              className="rounded py-3 px-6 w-fit"
              style={{
                backgroundColor:
                  data.status === "Looking to give client for commission."
                    ? "#4b5e6d"
                    : "#c2cfd8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  color:
                    data.status === "Looking to give client for commission."
                      ? "white"
                      : "black",
                }}
              >{`Status: ${data.status}`}</p>
            </div>
          ) : null}

          <div className="mb-[60px]">
            <p className="text-[18px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-4 1bp:text-[16.5px]">
              About
            </p>
            <div className="max-w-[540px] font-[Poppins] font-normal text-[16px] leading-[24px] text-[#0D1011]">
              <p>{data?.description}</p>
            </div>
          </div>
          <div className="flex flex-row gap-[35px] mb-[60px]">
            <div className="flex flex-row gap-[5px] items-center">
              <img
                className="w-[17px] h-[17px]"
                src="/assets/size.svg"
                alt="Size"
              />
              <p className="font-[Montserrat] text-[14px] text-[#061A40]">
                <span className="font-bold">Size:</span> {data?.size}
              </p>
            </div>
            <div className="flex flex-row gap-[5px] items-center">
              <img
                className="w-[17px] h-[17px]"
                src="/assets/industry.svg"
                alt="Industry"
              />
              <p className="font-[Montserrat] text-[14px] text-[#061A40]">
                <span className="font-bold">Industry:</span> {industry}
              </p>
            </div>
          </div>
          {/* <div>
            <p className="text-[18px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-4 1bp:text-[16.5px]">
              Lists for Sale
            </p>
            <div className="flex flex-row flex-wrap gap-[32px] mb-[65px]">
              {typeof data.lists != "undefined" && data.lists.length > 0 && (
                <>
                  {data.lists.map((item, index) => {
                    return <ListCard item={item}></ListCard>;
                  })}
                </>
              )}
            </div>
          </div> */}
        </>
      ) : (
        <div>
          <p className="text-center">Loading...</p>
        </div>
      )}
    </div>
  );
}
