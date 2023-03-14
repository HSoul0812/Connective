import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
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
      var individual = await DAO.Individual.getByUserId(Number(id));
      /*
      var [listResults, listFields] = await connection
        .promise()
        .query(
          `SELECT Lists.*, Individual.name AS username, Individual.profile_picture AS logo, Individual.status FROM Lists JOIN Individual on Lists.creator = Individual.user_id WHERE creator=${id};`
        );
      var [purchaseResults, fields] = await connection
        .promise()
        .query(
          `select * from Lists join purchased_lists on purchased_lists.list_id = Lists.id;`
        );

      (listResults as Array<RowDataPacket>).forEach((list: RowDataPacket) => {
        list.buyers = (purchaseResults as Array<RowDataPacket>).filter(
          (i: RowDataPacket) => {
            if (i.list_id == list.id) return 1;
          }
        ).length;
      });

      results[0].lists = listResults;
      */
      res.status(200).json({ individual } as ProfileApiResponse.IIndividual);
    }
    if (req.method == "POST") {
      const { name, bio, pfp, location, status, industry, occupation } =
        req.body;
      await DAO.Individual.add(
        user.id,
        name,
        bio,
        pfp,
        location,
        0,
        0,
        industry,
        status,
        occupation
      );
      res.status(200).json({ success: true });
    }
    if (req.method == "PATCH") {
      //Implement
    }
    if (req.method == "PUT") {
      // console.log(user);
      const { name, bio, pfp, location, pfpChanged, status, isSubscribed } =
        req.body;

      await DAO.Individual.update(
        user.id,
        pfpChanged,
        pfp,
        name,
        bio,
        location,
        status,
        isSubscribed
      );

      res.status(200).json({ success: true });
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
