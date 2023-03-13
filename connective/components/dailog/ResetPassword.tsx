import React, { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  email: string;
  setResetPassword: (value: boolean) => void;
  expiredError?: boolean;
};

const EmailVerification = ({
  email,
  setResetPassword,
  expiredError,
}: Props) => {
  const [otpError, setOtpError] = useState<string>("");

  useEffect(() => {
    if (expiredError) {
      setOtpError("You can send only 2 requests in 15 minutes");
    }
  }, [expiredError]);

  const handleResendEmail = async () => {
    setOtpError(null);
    const verifiedEmail = await axios({
      method: "post",
      url: "/api/auth/resendLink",
      data: { email },
    });
    if (
      verifiedEmail?.data?.error ===
      "You can send only 2 requests in 15 minutes"
    ) {
      setOtpError("You can send only 2 requests in 15 minutes");
    } else {
      setOtpError(null);
    }
    return;
  };

  const toSignInPage = (): void => {
    setResetPassword(false);
  };

  return (
    <div>
      <div id="content" role="main" className="w-full max-w-md mx-auto p-6">
        <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Please check your email
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We've sent instructions on how to set a new password to {email}.
              </p>
            </div>
            <div className="mt-2">
              <div className="grid gap-y-4">
                <div>
                  {otpError ? (
                    <p className="text-center text-xs text-red-600 mt-2">
                      {otpError}
                    </p>
                  ) : null}
                  <p
                    className="text-center text-xs text-red-600 mt-2"
                    id="email-error"
                    onClick={handleResendEmail}
                  >
                    Didn't get an email?{" "}
                    <span className=" cursor-pointer">Click to resend</span>
                  </p>
                </div>
                <div className="w-full text-center">
                  <div className="w-7/12 inline-block mt-2">
                    <button
                      type="button"
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                      onClick={toSignInPage}
                    >
                      Enter new password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
