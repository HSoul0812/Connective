export const Events: { [key: string]: string | ((id: string) => string) } = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  SEND_MESSAGE: "send_message",
  NEW_MESSAGE_TO_ID: (id: string) => `NEW_MESSAGE_TO_${id}`,
  NEW_UNREAD_CONVERSATION_RECEIVER_ID: (id) => `NEW_UNREAD_CONVERSATION_${id}`,
  SEND_UNREAD_CONVERSATION_TO_RECEIVER: "send-unread-conversation-to-receiver",
};
