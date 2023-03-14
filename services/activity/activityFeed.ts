const mysql = require("mysql2");
const moment = require("moment");

const addActivityFeed = async (activity: string, message: string) => {
  if (!activity || !message) return false;

  const connection = mysql.createConnection(process.env.DATABASE_URL);
  const timestamp = moment().format("YYYY/MM/DD HH:mm:ss");
  try {
    await connection
      .promise()
      .query(
        `INSERT INTO platform_activity_feed (activity, message, timestamps) VALUES ('${activity}', '${message}', '${timestamp}');`
      );
    connection.end();
    return true;
  } catch (error) {
    return false;
  }
};

export namespace ActivityFeed {
  export class Auth {
    static async handleAuth(activity: string, message: string) {
      await addActivityFeed(activity, message);
    }
  }

  export class Messages {
    static async handleMessage(sender: string, receiver: string, text: string) {
      let activityArray = [
        {
          message: `user ${sender} sent message to ${receiver} saying "${text}"`,
          activity: "message_sent",
        },
      ];
      let activity: string;
      let message: string;

      /* Handle Conversation */
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      const [existConversation, fields, err] = await connection
        .promise()
        .query(
          `SELECT * FROM messages WHERE (sender='${sender}' AND receiver = '${receiver}') OR (sender='${receiver}' AND receiver = '${sender}');`
        );

      if (!existConversation.length) {
        activityArray.push({
          message: `new conversation started between ${sender} and ${receiver}`,
          activity: `new_conversation`,
        });
      }

      /* Handle Initial Responded */
      const [recievedMessages] = await connection
        .promise()
        .query(
          `SELECT * FROM messages WHERE sender='${receiver}' AND receiver = '${sender}';`
        );

      if (recievedMessages.length > 0) {
        const [sendedMessages, fields, err] = await connection
          .promise()
          .query(
            `SELECT * FROM messages WHERE sender='${sender}' AND receiver = '${receiver}';`
          );
        if (sendedMessages.length === 0) {
          activityArray.push({
            message: `user ${sender} responded to first message in conversation started by ${receiver}`,
            activity: `initial_response`,
          });
        }
      }

      /* Message sent */

      await Promise.all(
        activityArray.map(async (activity) => {
          await addActivityFeed(activity.activity, activity.message);
        })
      );
    }
  }

  export class Discover {
    static async viewDiscover(userId: string) {
      await addActivityFeed("pageview_discover", `user ${userId} viewed the discover page`);
    }
  }
}