import axios from "axios";
import { EmailContent } from "../types/types";

class Api {
  email = async (type: string, message: EmailContent) => {
    if (type === "SMTP") {
      try {
        const res = await axios.post("/api/notifications/mail", {
          header: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          data: message,
        });

        if (res) {
          return true;
        }
        return false;
      } catch (error) {
        console.log("Failed " + error);
      }
    } else {
    }
  };
}

export default new Api();
