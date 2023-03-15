export type UserSession = {
  user: User;
};

export type User = {
  email: string;
  id: number;
};

export type Message = {
  sender: number;
  receiver: number;
  text: string;
};

export type Conversation = {
  id: number;
  email: string;
  username: string;
  location: string;
  logo: string;
  unread?: number;
};

export type ConversationToReceiver = {
  conversationsWithUnReadCount: Conversation;
  receiverId: string;
};
