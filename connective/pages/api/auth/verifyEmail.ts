import { DAO } from "../../../lib/dao";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  AuthApiResponse,
  IApiResponseError,
} from "../../../types/apiResponseTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { code, email } = req.body;
    let user = await DAO.Users.getByEmail(email);

    if (typeof(user) != "boolean") {
      if (user.verify_email_otp === code) {
        await DAO.Users.updateVerificationStatus(true, email);
        return res
          .status(201)
          .json({ success: true } as AuthApiResponse.IVerifyEmail);
      } else {
        res
          .status(200)
          .json({
            success: false,
            error: "Incorrect verification code",
          } as IApiResponseError);
      }
    } else {
      res
        .status(200)
        .json({ success: false, error: "User not found" } as IApiResponseError);
    }
  } catch (e) {
    console.log(e);
    return res
      .status(200)
      .json({ success: false, error: e } as IApiResponseError);
  }
}
