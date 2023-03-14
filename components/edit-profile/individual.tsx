import InputField from "../input-field";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FileUpload from "../file-upload";
import Util from "../../util";
import Select from "react-select";
import { User } from "../../types/types";
import {
  ProfileApiResponse,
  IApiResponseError,
} from "../../types/apiResponseTypes";

type Props = {
  user: User;
};

export default function EditProfile({ user }: Props) {
  const [name, setName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isSubscribed, setSubscribed] = useState<boolean>(false);
  const [pfp, setPfp] = useState<Blob>();
  const [src, setSrc] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [pfpChanged, setPfpChanged] = useState<boolean>(false);
  const [curruntStatus, setCurruntStatus] = useState<string>("");
  useEffect(() => {
    setLoaded(false);
    getProfile();
  }, []);

  const getProfile = async () => {
    await axios.get("/api/profiles/individual").then((res) => {
      let data: ProfileApiResponse.IIndividual | IApiResponseError = res.data;
      if (data.type == "IApiResponseError") {
        throw data;
      } else {
        let individual = data.individual;
        setUserId(individual.user_id.toString());
        setSrc(individual.profile_picture);
        setName(individual.name);
        setDescription(individual.bio);
        setLocation(individual.location);
        setStatus(individual.status);
        setSubscribed(individual.is_subscribed);
        setLoaded(true);
        setCurruntStatus(individual.status);
      }
    });
  };

  const statusOptions = [
    {
      value: "Looking to give client for commission.",
      label: "Looking to give client for commission.",
    },
    {
      value: "Looking to get client for a commission.",
      label: "Looking to get client for a commission.",
    },
    {
      value: "Looking to expand my network",
      label: "Looking to expand my network",
    },
  ];

  const router = useRouter();

  useEffect(() => {
    if (pfp == null || pfp == undefined || typeof pfp == "undefined") return;
    setPfpChanged(true);
    setSrc(URL.createObjectURL(pfp));
  }, [pfp]);

  const submit = async () => {
    if (processing) return;
    setProcessing(true);

    if (name == "") {
      setNameError("You must enter a name.");
      return;
    }

    setNameError("");

    let hasPfp = false;
    if (pfp != null && pfp != undefined && typeof pfp != "undefined") {
      hasPfp = true;
    }

    let uploadUrl;
    if (hasPfp) {
      uploadUrl = await Util.uploadFile(user.id + "-pfp", pfp);
    }

    await axios
      .put("/api/profiles/individual", {
        pfp: hasPfp ? uploadUrl : "",
        pfpChanged,
        name,
        bio: description,
        location,
        status,
        isSubscribed,
      })
      .then(async (res) => {
        if (res.status == 200) {
          console.log("success");
          if (status !== curruntStatus) {
            await axios.post("/api/notifications/sendEmailOnStatusChange", {
              userId,
              status,
              profile: "Individual",
            });
          }
          router.push(`/app/profile/${userId}`);
        }
      })
      .catch((e) => {
        if (
          e.response.status == 403 ||
          e.response.data.error == "Account does not exist"
        ) {
        }
      });

    setProcessing(false);
  };

  const changeSubscription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscribed(e.target.checked);
  };

  return loaded ? (
    <main className="flex flex-row min-h-screen min-w-screen">
      <div className="flex flex-col w-[40vw] mx-auto font-[Montserrat] bg-[#F9F9F9] rounded-xl shadow-md p-5 my-20">
        <div className="flex flex-row gap-10 mb-10">
          <p className="text-3xl font-bold">Edit Profile</p>
        </div>

        <div className="flex flex-col gap-5 mt-0">
          <InputField
            name={"Name*"}
            placeholder={"Enter your name"}
            updateValue={setName}
            errorText={nameError}
            value={name}
          />
          <InputField
            name={"Bio"}
            placeholder={"Enter your bio"}
            updateValue={setDescription}
            textarea={true}
            value={description}
          ></InputField>
          <div>
            <p className="text-sm mb-2">Profile picture</p>
            <FileUpload
              text="Upload profile picture"
              file={pfp}
              setFile={setPfp}
              id={"Individual pfp upload"}
              src={src}
              profilePicture={true}
              user={name}
              editProfile={true}
            ></FileUpload>
          </div>
          <InputField
            name={"Location"}
            placeholder={"Enter your location"}
            updateValue={setLocation}
            value={location}
          ></InputField>
          <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] 1bp:text-[16.5px]">
            Status
          </p>
          <Select
            className="w-full text-[12px] font-[Poppins]"
            onChange={(e) => {
              setStatus(e.value);
            }}
            options={statusOptions}
            placeholder="Choose your Status"
            value={{ value: status, label: status }}
          ></Select>
          <div className="flex flex-row gap-4 items-center">
            <input
              className="b-[#0D1011] b-[0.5px] w-[16px] h-[16px] 1bp:w-[20px] 1bp:h-[20px]"
              type="checkbox"
              checked={isSubscribed}
              onChange={changeSubscription}
            ></input>
            <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] 1bp:text-[16.5px]">
              Subscribe to newsletter
            </p>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={processing}
          className={`w-full  font-bold text-white py-4 mt-20 rounded-md shadow-md transition-all ${
            !processing
              ? "hover:scale-105 hover:shadow-lg bg-[#0F172A]"
              : "bg-[#0F172A]/70"
          }`}
        >
          Save Profile
        </button>
      </div>
    </main>
  ) : (
    <>Loading...</>
  );
}
