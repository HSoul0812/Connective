export const Events: { [key: string]: string | ((id: string) => string) } = {
  SEND_MESSAGE: "send_message",
  DISCONNECT: "disconnect",
  SEND_UNREAD_CONVERSATION_TO_RECEIVER: "send-unread-conversation-to-receiver",
  CONNECT: "connect",
  CONNECT_ERROR:"connect_error",
  PUSH_UNREAD_CONVERSATION: "push-unread-conversation",
  NEW_MESSAGE_TO_ID: (id) => `NEW_MESSAGE_TO_${id}`,
  NEW_UNREAD_CONVERSATION_RECEIVER_ID: (id) => `NEW_UNREAD_CONVERSATION_${id}`,
};
