import { withIronSession } from "next-iron-session";
import type { NextApiRequest, NextApiResponse } from "next";
import { DAO } from "../../../lib/dao";
import {
  IApiResponseError,
  ProfileApiResponse,
} from "../../../types/apiResponseTypes";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // @ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res
        .status(403)
        .json({ success: false, error: "Not signed in" } as IApiResponseError);
    }
    if (req.method == "GET") {
      let { id } = req.query;
      if (typeof id == "undefined") id = user.id;

      // Returns callers account
      var business = await DAO.Business.getByUserId(Number(id));
      /*
      var [listResults, listFields, listErr] = await connection
        .promise()
        .query(
          `SELECT Lists.*, Business.company_name AS username, Business.logo, Business.status FROM Lists JOIN Business on Lists.creator = Business.user_id WHERE creator=${id};`
        );

      var [purchaseResults, fields, err] = await connection
        .promise()
        .query(
          `select * from Lists join purchased_lists on purchased_lists.list_id = Lists.id;`
        );

      listResults.forEach((list) => {
        list.buyers = purchaseResults.filter((i) => {
          if (i.list_id == list.id) return 1;
        }).length;
      });

      business.lists = listResults;
      */
      res.status(200).json({ business } as ProfileApiResponse.IBusiness);
    }
    if (req.method == "POST") {
      const {
        name,
        description,
        pfp,
        url,
        location,
        industry,
        occupation,
        size,
        status,
      } = req.body;
      await DAO.Business.add(
        user.id,
        name,
        description,
        pfp,
        url,
        location,
        industry,
        size,
        status
      );
      res.status(200).json({ success: true });
    }
    if (req.method == "PATCH") {
      // Implement
    }
    if (req.method == "PUT") {
      const {
        name,
        pfp,
        location,
        description,
        industry,
        size,
        url,
        pfpChanged,
        status,
        isSubscribed,
      } = req.body;

      await DAO.Business.update(
        user.id,
        name,
        pfpChanged,
        pfp,
        description,
        location,
        industry,
        size,
        url,
        status,
        isSubscribed
      );

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
