import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import { DAO } from "../../../lib/dao";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;
  try {
    // @ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      // Returns callers account
      var listsViewedResult = null;
      if (type == "business") {
        listsViewedResult = await DAO.Business.getByUserId(user.id);
      } else {
        listsViewedResult = await DAO.Individual.getByUserId(user.id);
      }
      let listsViewed = listsViewedResult?.listViews;

      const purchasedListsResults = await DAO.Lists.getPurchasedListByBuyerId(
        user.id
      );
      var purchasedLists = purchasedListsResults.length;
      var totalSpent = 0;
      purchasedListsResults.forEach((item) => {
        totalSpent += item.price;
      });

      const createdListResults = await DAO.Lists.getListsByCreator(user.id);
      var listsCreated = createdListResults.length;

      const soldListResults = await DAO.Lists.getPurchasedListByCreatorId(
        user.id
      );
      var listsSold = soldListResults.length;
      var totalEarned = 0;
      soldListResults.forEach((item) => {
        totalEarned += item.price;
      });

      console.log("Lists Viewed: " + listsViewed);
      console.log("Purchased Lists: " + purchasedLists);

      res.status(200).json({
        listsViewed,
        purchasedLists,
        totalSpent,
        listsCreated,
        listsSold,
        totalEarned,
      });
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
