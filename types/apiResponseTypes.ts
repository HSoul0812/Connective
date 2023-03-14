import {
  Business,
  Conversation,
  DiscoverUser,
  Individual,
  Message,
  User,
} from "./types";

export interface IApiResponseError {
  success: boolean;
  error: string | Error;
  type: "IApiResponseError";
}

export namespace AuthApiResponse {
  export interface IVerifyLink {
    success: boolean;
    type: "IVerifyLink";
  }

  export interface IVerifyEmail {
    success: boolean;
    type: "IVerifyEmail";
  }

  export interface ISignup {
    success: boolean;
    type: "ISignup";
  }

  export interface ISessions {
    accountExists?: boolean;
    type: "ISessions";
  }
}

export namespace MessagesApiResponse {
  export interface IGetOtherID {
    messages: Message[];
    type: "IGetOtherID";
  }

  export interface IPostOtherID {
    insertId: number;
    type: "IPostOtherID";
  }

  export interface IConversations {
    conversations: Conversation[];
    type: "IConversations";
  }
}

export namespace ProfileApiResponse {
  export interface IBusiness {
    business: Business;
    type: "IBusiness";
  }

  export interface IIndividual {
    individual: Individual;
    type: "IIndividual";
  }

  export interface IDiscoverProfiles {
    users: DiscoverUser[];
    type: "IDiscoverProfiles";
  }

  export interface IProfiles {
    users: User[];
    type: "IProfiles";
  }
}
