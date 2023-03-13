import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export const sendEmail = async (subject: string, template: string, email: string) => {
  return new Promise((resolve, reject) => {
    console.log("Sending an email to " + email);
    const msg = {
      to: email,
      from: "notifications@connective-app.xyz",
      subject: subject,
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
        console.log(error?.response?.body)
      });
  });
};

module.exports = { sendEmail };
