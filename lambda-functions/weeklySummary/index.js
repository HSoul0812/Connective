require("dotenv").config();
const mysql = require("mysql2");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const connection = mysql.createConnection(process.env.DATABASE_URL);

exports.handler = async () => {
  try {
    const [users] = await connection
      .promise()
      .query("SELECT * FROM Users WHERE email_verified = true");
    if (!users.length) return;

    await Promise.all(
      users.map(async (user) => {
        const userId = user.id;
        let industry = "";

        const businessQuery = `SELECT * FROM Business WHERE user_id=?;`;
        const [businessProfile] = await connection
          .promise()
          .query(businessQuery, [userId]);

        const IndividualQuery = `SELECT * FROM Individual WHERE user_id=?;`;
        const [IndividualProfile] = await connection
          .promise()
          .query(IndividualQuery, [userId]);

        if (businessProfile.length) {
          profileName = "Business";
          industry = businessProfile[0].industry;
        } else if (IndividualProfile.length) {
          profileName = "Individual";
          industry = IndividualProfile[0].industry;
        } else {
          return;
        }

        /* Fetching same industry users*/
        const businessUsersquery = `SELECT Business.user_id, Business.company_name as name, Business.industry, Business.status, Users.email FROM Business INNER JOIN Users ON Business.user_id = Users.id WHERE industry='${industry}'`;

        const individualUsersquery = `SELECT Individual.user_id, Individual.name, Individual.industry, Individual.status, Users.email FROM Individual INNER JOIN Users ON Individual.user_id = Users.id WHERE industry='${industry}'`;

        const [businessUsers] = await connection
          .promise()
          .query(businessUsersquery);
        const [individualUsers] = await connection
          .promise()
          .query(individualUsersquery);

        if (!businessUsers.length || !individualUsers.length) return;

        let giveCommisionUsers = [];
        let getCommisionUsers = [];
        [...businessUsers, ...individualUsers].forEach((user) => {
          if (
            user.status &&
            user.status === "Looking to give client for commission."
          ) {
            giveCommisionUsers.push(user);
          } else if (
            user.status &&
            user.status === "Looking to get client for a commission."
          ) {
            getCommisionUsers.push(user);
          }
        });

        let template = [
          `<p>Hello There,</p>
            Following are the agencies looking to give/get clients for commission.<br/>`,
        ];

        if (giveCommisionUsers.length) {
          template.push(
            `<p>Agencies/Individuals looking to give clients for commission:</p>`
          );
          giveCommisionUsers.map((giveCommisionUser) => {
            template.push(`
            • <a href="https://connective-app.vercel.app/app/profile/${giveCommisionUser.user_id}">${giveCommisionUser.name}</a><br/>`);
            return;
          });
          template.push(`<br/>`);
        }

        if (getCommisionUsers.length) {
          template.push(
            `<p>Agencies/Individuals looking to get client for a commission:</p>`
          );
          getCommisionUsers.map((getCommisionUser) => {
            template.push(`
                    • <a href="https://connective-app.vercel.app/app/profile/${getCommisionUser.user_id}">${getCommisionUser.name}</a><br/>`);
            return;
          });
          template.push(`<br/>`);
        }

        template.push(`
                    <p>Message them and start to grow your affiliate partner network.</p>
                    Thanks<br/>
                    Team Connective</p>`);
        sendEmail(user.email, template.join(""))
          .then(() => {})
          .catch(() => {
            console.log(error);
          });
      })
    );
  } catch (error) {
    console.log(error);
  }
};

async function sendEmail(to, content) {
  return new Promise((resolve, reject) => {
    console.log("Sending an email to " + to);
    const msg = {
      to,
      from: "notifications@connective-app.xyz",
      subject: "Connective: Weekly summary",
      text: "Connective",
      html: `${content}`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log(`Email sent successfully to ${to}`);
        resolve();
      })
      .catch((error) => {
        console.error(error);
      });
  });
}
