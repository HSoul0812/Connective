import { withIronSession } from "next-iron-session";
import { DAO } from "../../../../lib/dao";
import { NextApiRequest, NextApiResponse } from "next";
import {
  IApiResponseError,
  ProfileApiResponse,
} from "../../../../types/apiResponseTypes";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  try {
    // @ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res
        .status(403)
        .json({ success: false, error: "Not signed in" } as IApiResponseError);
    }
    if (req.method == "GET") {
      //Returns callers account
      res
        .status(200)
        .json({
          individual: await DAO.Individual.getByUserId(Number(id)),
        } as ProfileApiResponse.IIndividual);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
  }
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
