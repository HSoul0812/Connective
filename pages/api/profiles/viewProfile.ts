import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import { DAO } from "../../../lib/dao";
import { IApiResponseError } from "../../../types/apiResponseTypes";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // @ts-ignore
    if (typeof req.session.get().user == "undefined") {
      return res
        .status(500)
        .json({ success: false, error: "Not signed in" } as IApiResponseError);
    }
    if (req.method == "POST") {
      const { id, type } = req.body;

      if (type == "business") await DAO.Business.incrementProfileViews(id);
      else await DAO.Individual.incrementProfileViews(id);

      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, error: e } as IApiResponseError);
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
