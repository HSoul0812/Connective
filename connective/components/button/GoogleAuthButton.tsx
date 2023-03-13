import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import googleIcon from "../../public/assets/google-icon.svg";
import { AuthApiResponse } from "../../types/apiResponseTypes";

type Props = {
  isSignUp: boolean;
};

const GoogleAuthButton = ({ isSignUp = false }: Props) => {
  const router = useRouter();
  const { token, email } = router.query;
  const [isWorking, setIsWorking] = useState<boolean>(false);

  const googleSignIn = (accessToken: string, email: string) => {
    setIsWorking(true);

    axios({
      method: "post",
      url: "/api/auth/sessions",
      data: { email, accessToken, type: "google" },
    })
      .then((res) => {
        const data: AuthApiResponse.ISessions = res.data;
        if (res.status == 201) {
          data.accountExists
            ? router.push("/app/discover")
            : router.push("/onboarding/create-profile");
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsWorking(false);
      });
  };

  useEffect(() => {
    if (token && email) {
      googleSignIn(token.toString(), email.toString());
    }
  }, [token, email]);

  return (
    <div>
      <div className="flex justify-center">
        <button
          disabled={isWorking}
          onClick={() => signIn("google")}
          className="flex justify-center items-center w-[229px] h-[47px] bg-slate-50 font-semibold font-[Poppins] text-black text-[13px] leading-[18px] text-center rounded-[8px] shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:bg-slate-200 disabled:hover:bg-slate-200 disabled:hover:scale-100 disabled:hover:shadow-none 1bp:text-[16px]"
        >
          <Image
            src={googleIcon}
            alt="Connective logo"
            width="30px"
            height="30px"
            style={{ marginRight: "3px", border: "1px solid black" }}
          />
          <span className="ml-2">
            {isSignUp
              ? isWorking
                ? "Signing up..."
                : "Sign up With Google"
              : isWorking
              ? "Signing in..."
              : "Sign in With Google"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default GoogleAuthButton;
