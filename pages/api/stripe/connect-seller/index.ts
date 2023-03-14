import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import Stripe from "stripe";
import { DAO } from "../../../../lib/dao";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null);

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const host = req.headers.host;
    console.log(host);
    if (req.method === "POST") {
      // @ts-ignore
      let user = req.session.get().user;
      if (typeof user == "undefined") {
        return res.status(403).json({ success: false, error: "Not signed in" });
      }
      if (typeof user == "undefined") {
        return res.status(500).json({ success: false, error: "Not signed in" });
      }

      const result = await DAO.Users.getById(user.id);
      // @ts-ignore
      connection.close();
      if (typeof(result) != "boolean" &&result) {
        // fetch stripeID from the db;
        const accountLink = await stripe.accountLinks.create({
          account: result.stripeID,
          refresh_url:
            process.env.NODE_ENV === "test"
              ? "http:"
              : "https:" + "//" + host + process.env.refreshURL,
          return_url:
            process.env.NODE_ENV === "test"
              ? "http:"
              : "https:" + "//" + host + process.env.returnURL,
          type: "account_onboarding",
        });
        return res
          .status(200)
          .json({ success: true, accountLink: accountLink.url });
      } else {
        return res.json({ error: "User not found", success: false });
      }
    } else {
      return res.json({ error: "Only POST request is valid", success: false });
    }
  } catch (e) {
    console.log(e);
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
