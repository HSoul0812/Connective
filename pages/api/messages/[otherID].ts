import { withIronSession } from "next-iron-session";
import { DAO } from "../../../lib/dao";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  IApiResponseError,
  MessagesApiResponse,
} from "../../../types/apiResponseTypes";
import { ActivityFeed } from "../../../services/activity/activityFeed";
import { io, Socket } from "socket.io-client";
import { Events } from "../../../common/events";
import EventEmitter from "events";

const eventEmitter: EventEmitter = new EventEmitter();
let socketIO: Socket;

eventEmitter.on(
  Events.PUSH_UNREAD_CONVERSATION as string,
  async (receiverId: number) => {
    console.log(
      `New conversation push started with receiver id: ${receiverId}`
    );
    const conversationsWithUnReadCount =
      await DAO.Messages.getConversationsWithUnReadCount(receiverId);
    socketIO.emit(Events.SEND_UNREAD_CONVERSATION_TO_RECEIVER as string, {
      conversationsWithUnReadCount,
      receiverId,
    });

    console.log(`socket emitted with id: ${
      Events.SEND_UNREAD_CONVERSATION_TO_RECEIVER
    },
      and payload ${JSON.stringify(conversationsWithUnReadCount)}`);
  }
);

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { otherID } = req.query;
  try {
    // @ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res
        .status(500)
        .json({ success: false, error: "Not signed in" } as IApiResponseError);
    }
    if (req.method == "GET") {
      var messages = await DAO.Messages.getByOtherUser(
        user.id,
        Number(otherID)
      );
      messages = messages.sort((a, b) => {
        return a.id - b.id;
      });
      res.status(200).json({ messages } as MessagesApiResponse.IGetOtherID);
    }
    if (req.method == "POST") {
      const { text } = req.body;
      await ActivityFeed.Messages.handleMessage(
        user.id,
        otherID.toString(),
        text
      );
      socketIO = io(process.env.SOCKET_HOST, {
        autoConnect: false,
        timeout: 300,
      });
      socketIO.connect();

      const addMessageAndSendResponse = async (user, otherID, text) => {
        try {
          let insertId = await DAO.Messages.add(user.id, Number(otherID), text);
          return { status: 200, insertId };
        } catch (error) {
          console.error(error);
          return { status: 500, error: "Error adding message" };
        }
      };

      if (socketIO.connected) {
        const response = await addMessageAndSendResponse(user, otherID, text);

        eventEmitter.emit(Events.PUSH_UNREAD_CONVERSATION as string, otherID);

        res.status(response.status).json({
          insertId: response.insertId,
        } as MessagesApiResponse.IPostOtherID);
      } else {
        await new Promise((res, rej) => {
          socketIO.on(Events.CONNECT as string, () => {
            res("connected");
          });
          socketIO.on(Events.CONNECT_ERROR as string, () => {
            rej(Error("unable to connect to socket error"));
          });
        });

        const response = await addMessageAndSendResponse(user, otherID, text);

        eventEmitter.emit(Events.PUSH_UNREAD_CONVERSATION as string, otherID);

        res.status(response.status).json({
          insertId: response.insertId,
        } as MessagesApiResponse.IPostOtherID);
        res.end();
      }
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, error: e } as IApiResponseError);
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
