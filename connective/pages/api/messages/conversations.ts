import { DAO } from "../../../lib/dao";
import { withIronSession } from "next-iron-session";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  IApiResponseError,
  MessagesApiResponse,
} from "../../../types/apiResponseTypes";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // @ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res
        .status(500)
        .json({ success: false, error: "Not signed in" } as IApiResponseError);
    }
    if (req.method == "GET") {
      let conversations = await DAO.Messages.getConversationsWithUnReadCount(user.id);
      res
        .status(200)
        .json({ conversations } as MessagesApiResponse.IConversations);
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
