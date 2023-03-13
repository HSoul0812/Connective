import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import { DAO } from "../../../lib/dao";
import { mailOptions, transporter } from "../../../services/nodemailer";

export default async function apiNewSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "GET") {
      const messages = await DAO.Messages.getUnnotified();

      let groupedMessages = _.mapValues(
        _.groupBy(messages, "email"),
        (mlist: Array<any>) => mlist.map((msg) => _.omit(msg, msg.email))
      );

      await mailer(groupedMessages);
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({ success: false, error: e });
  }
}
const markSentMessages = async (messages: Array<any>) => {
  messages.forEach(async function (message: any) {
    await DAO.Messages.updateNotifyForSentMessage(message.id);
  });
};

const mailer = async (emails: any) => {
  const mail = `
    <p>Hello There,</p>
    <p>You have an unread message from an affiliate partner on Connective. Please <a href="${process.env.BASE_URL}/auth/signin">sign in</a> below and respond to them.<br/>

    Thanks
    <br/>
    <br/>
    Team Connective</p>`;

  for (const msg in emails) {
    mailOptions.to = msg;
    const send = await transporter.sendMail({
      ...mailOptions,
      subject: "Affiliate partner sent you a message",
      text: mail.replace(/<[^>]*>?/gm, ""),
      html: mail,
    });

    if (send) {
      await markSentMessages(emails[msg]);
    }
  }
};
