import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { DAO } from "../../../lib/dao";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);
    let user = await DAO.Users.getByEmail(email);
    if (typeof(user) != "boolean") {
      if (user.send_code_attempt && user.send_code_attempt == 2) {
        const lastCodeSentTime = user.last_code_sent_time;
        const diff = moment().diff(lastCodeSentTime, "minutes");

        if (diff < 15) {
          return res.status(200).json({
            success: false,
            error: "You can send another code in 15 minutes",
          });
        }
      }
      await sendEmail(code.toString(), email);
      const sendCodeAttempt = user.send_code_attempt
        ? Number(user.send_code_attempt) + 1
        : 1;

      await DAO.Users.updateOtpCode(code.toString(), sendCodeAttempt, email);
    }
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(200).json({ success: false, error: e });
  }
}

async function sendEmail(code: string, email: string) {
  return new Promise((resolve, reject) => {
    console.log("Sending an email to " + email);
    const template = `<p>Hello There,</p>
      <p>${code}, Please use this otp to verify your email address.<br/>

      Thanks
      <br/>
      <br/>
      Team Connective</p>`;

    const msg = {
      to: email,
      from: "notifications@connective-app.xyz",
      subject: "Email Verification",
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
