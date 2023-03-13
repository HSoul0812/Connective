import { sendEmail } from "../../../lib/notifications/sendEmail";
import { DAO } from "../../../lib/dao";

export default async function handler(req, res) {
  try {
    const { userId, profile } = req.body;
    const { secretKey } = req.query;

    if (secretKey !== process.env.APPSMITH_SECRET_KEY) {
      return res.status(403).json({ success: false, error: "unauthorized" });
    }
    if (!userId || !profile) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide data" });
    }

    let user = null;
    if (profile === "Individual") {
      user = await DAO.Individual.getByUserId(userId);
    } else {
      user = await DAO.Business.getByUserId(userId);
    }

    if (user) {
      const industry: string = user.industry;
      let users = await DAO.Users.getByIndustry(industry, profile);

      if (typeof(users) != "boolean" && users.length) {
        users = users.filter((user) => user.id != userId);
        users.forEach(async (user) => {
          const subject = "Connective: Status updated";
          const template = `Hello There!<br/>
A new user just joined Connective. Connect with them to form affiliate partnerships. Happy Networking!.<br/>
Thanks<br/>
Connective Team`;
          await sendEmail(subject, template, user.email);
        });
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
