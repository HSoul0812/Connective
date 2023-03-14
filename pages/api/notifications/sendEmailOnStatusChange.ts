import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import { sendEmail } from "../../../lib/notifications/sendEmail";
import { DAO } from "../../../lib/dao";
import { Business, Individual, TruncatedUser } from "../../../types/types";

export async function handler(req, res) {
  try {
    const { status, profile } = req.body;
    const sessionUser = req.session.get().user;
    const userId = sessionUser.id;

    let user: Business | Individual | boolean = null;
    let userName: string = "";

    if (profile === "Individual") {
      user = await DAO.Individual.getByUserId(userId);
      if (typeof user == "boolean") return;
      userName = user.name;
    } else {
      user = await DAO.Business.getByUserId(userId);
      if (typeof user == "boolean") return;
      userName = user.company_name;
    }

    if (user) {
      const industry: string = String(user.industry);
      let users: Array<TruncatedUser> | boolean = await DAO.Users.getByIndustry(
        industry,
        profile
      );

      if (typeof users != "boolean" && users.length) {
        users = users.filter((user) => user.user_id != userId);
        users.forEach(async (eachUser) => {
          const subject: string = "Connective: Status updated";
          const template: string = `Hello There!<br/>
${userName} on their platform updated the status to "${status}". Please message them if they fit your affiliate partnership criteria.<br/>
Thanks,<br/>
Team Connective.`;
          await sendEmail(subject, template, eachUser.email);
        });
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  },
});
