import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import Stripe from "stripe";
import { DAO } from "../../../../lib/dao";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null);

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // @ts-ignore
      let user = req.session.get().user;
      if (typeof user == "undefined") {
        return res.status(403).json({ success: false, error: "Not signed in" });
      }
      let id = req.query.id;
      if (typeof id == "undefined") id = user.id;

      if (typeof user == "undefined") {
        return res.status(500).json({ success: false, error: "Not signed in" });
      }

      const result = await DAO.Users.getById(user.id);
      // @ts-ignore
      connection.close();
      if (typeof(result) != "boolean" &&result) {
        const acc = await stripe.accounts.retrieve({
          stripeAccount: result.stripeID,
        });
        return res.json({ success: true, verified: acc.charges_enabled });
      } else {
        return res.json({ error: "User not found", success: false });
      }
    } else {
      return res.json({ error: "Only GET request is valid", success: false });
    }
  } catch {
    return res.json({ error: "Server error", success: false });
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
