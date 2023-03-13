import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import AWS from "aws-sdk";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // @ts-ignore
    if (typeof req.session.get().user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "POST") {
      const { name, type } = req.body;

      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
        region: "us-east-1",
        signatureVersion: "v4",
      });

      const fileParams = {
        Bucket: process.env.S3_BUCKET,
        Key: name,
        Expires: 600,
        ContentType: type,
        ACL: "public-read",
      };

      const url = await s3.getSignedUrlPromise("putObject", fileParams);

      res.status(200).json({ success: true, url });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
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
