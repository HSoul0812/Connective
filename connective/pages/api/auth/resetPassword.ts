import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import bcrypt from "bcryptjs";
import { DAO } from "../../../lib/dao";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password, token } = req.body;

    var user = await DAO.Users.getByEmailAndVerificationId(email, token);

    if (!user || token == "") {
      return res.status(403).json({
        success: false,
        error: "The link is incorrect.",
      });
    }

    if (user) {
      if (typeof(user) != "boolean" && user.verification_timestamp) {
        const diff = moment().diff(user.verification_timestamp, "minutes");

        if (diff > 15) {
          return res.status(403).json({
            success: false,
            error: "The link has expired.",
          });
        }
      }
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    user = await DAO.Users.getByEmailAndVerificationId(email, token);

    if (!user) {
      res.status(500).json({ success: false, error: "Email doesn't exist" });
    } else {
      DAO.Users.updatePasswordHashAndVerificationId(hash, "", email);

      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: e });
  }
}
