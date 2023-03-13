import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import sgMail from "@sendgrid/mail";
import { DAO } from "../../../lib/dao";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email } = req.body;
    let user = await DAO.Users.getByEmail(email);
    if (typeof(user) != "boolean" && user) {
      if (user.send_code_attempt && user.send_code_attempt == 2) {
        const lastLinkSentTime = user.verification_timestamp;
        const diff = moment().diff(lastLinkSentTime, "minutes");

        if (diff < 15) {
          return res.status(200).json({
            success: false,
            error: "You can send only 2 requests in 15 minutes",
          });
        }
      }

      const token = uuidv4();
      const link = `http://localhost:3000/auth/resetpassword/${email}/${token}`;

      await sendEmail(link, email);

      const sendCodeAttempt =
        user.send_code_attempt == 2 ? 1 : Number(user.send_code_attempt) + 1;

      await DAO.Users.updateVerification(token, sendCodeAttempt, email);
    }
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
  }
}

async function sendEmail(link: string, email: string) {
  return new Promise((resolve, reject) => {
    console.log("Sending an email to " + email);
    const template = `<p>Hello There,</p>
      <p>
        Connective-app.xyz has received a request to reset the password for your account.<br/>
        If you did not request to reset your password, please ignore this email.
        <br/>
        <br/>
      </p>
      <a href=${link}>Reset password now</a>`;

    const msg = {
      to: email,
      from: "notifications@connective-app.xyz",
      subject: "Reset your connective-app.xyz password",
      text: template.replace(/<[^>]*>?/gm, ""),
      html: template,
    };

    sgMail
      .send(msg)
      .then((data) => {
        console.log(`Email sent successfully to ${email}`);
        resolve(true);
      })
      .catch((error) => {
        reject(error.message);
        console.error(error);
      });
  });
}
