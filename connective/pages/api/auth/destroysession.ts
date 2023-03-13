import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";

function handler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-ignore
  req.session.destroy();
  res.send("session destroyed");
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
