import type { NextApiRequest, NextApiResponse } from "next";
import { DAO } from "../../../lib/dao";
import { withIronSession } from "next-iron-session";
import {
  ProfileApiResponse,
  IApiResponseError,
} from "../../../types/apiResponseTypes";
import { ActivityFeed } from "../../../services/activity/activityFeed";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //@ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      let users = await DAO.Discover.getAll();
      ActivityFeed.Discover.viewDiscover(user.id)
      res.status(200).json({ users } as ProfileApiResponse.IDiscoverProfiles);
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
