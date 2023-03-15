import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { UserIdsByConnectionKeys } from "../connection-maps/connection-keys.map";
import { UserIdsBySocketKeys } from "../connection-maps/socket-keys.map";
import { Events } from "./events";
import { socketService } from "./socket.service";
import { ConversationToReceiver, Message } from "./types";

const authHandler = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  const { token = "" } = socket.handshake.query || {};
  const isVerified = socketService.verifyKeyForUserId(token as string);
  console.log({ isVerified });
  if (isVerified) {
    next();
    return;
  }
  next(new Error("Forbidden"));
  return;
};

const createMapOfSocketIdByUserId = (token: string, socketId: string) => {
  const connectionKey = socketService.getDecryptedKey(token as string);
  const userId = UserIdsByConnectionKeys.get(connectionKey) || "";
  UserIdsBySocketKeys.set(socketId, userId);
};

class Connection {
  socket: Socket;
  io: Server;
  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;
    socket.on(Events.SEND_MESSAGE as string, (message: Message) =>
      this.sendMessage(message)
    );
    socket.on(Events.DISCONNECT as string, () => this.disconnect());
    socket.on(
      Events.SEND_UNREAD_CONVERSATION_TO_RECEIVER as string,
      (message: ConversationToReceiver) => this.sendUnReadConversationToReceiver(message)
    );
  }

  sendMessage(message: Message) {
    // if (UserIdsBySocketKeys.get(this.socket.id)) {
    if (typeof Events.NEW_MESSAGE_TO_ID === "function") {
      this.io.sockets.emit(
        Events.NEW_MESSAGE_TO_ID(`${message.sender}_${message.receiver}`),
        {
          ...message,
        }
      );
    }
    // }
  }

  sendUnReadConversationToReceiver(message: ConversationToReceiver) {
    if (typeof Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID === "function") {
      this.io.sockets.emit(
        Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID(message.receiverId),
        message.conversationsWithUnReadCount
      );
    }
  }

  disconnect() {
    console.log("client disconnect");
    UserIdsBySocketKeys.delete(this.socket.id);
  }
}

export const socketMiddleware = (io: Server) => {
  // io.use(authHandler);
  io.on(Events.CONNECTION as string, (socket: Socket) => {
    console.log("client connects");
    // const { token = '' } = socket.handshake.query || {};
    // createMapOfSocketIdByUserId(token as string, socket.id);
    // socketService.removeTokenFromConnectionKeys(token as string);
    new Connection(io, socket);
  });
};
