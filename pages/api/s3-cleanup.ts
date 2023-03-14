import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import AWS from "aws-sdk";
import { DAO } from "../../lib/dao";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // @ts-ignore
    if (typeof req.session.get().user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }

    if (req.method == "GET") {
      // Connect Database and fetch urls
      const lists = await DAO.Lists.getUrls();
      const usedLists = lists.map((url: string) => {
        return url.replace("https://connective-data.s3.amazonaws.com/", "");
      });

      // Config s3 bucket
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
        region: "us-east-1",
        signatureVersion: "v4",
      });
      let options = {
        Bucket: process.env.S3_BUCKET,
        Prefix: "list_",
      };

      //Fetch allKeys that have prefix "list_"
      let allKeys = [];
      const listAllKeys = async (opts) => {
        opts = { ...opts };
        do {
          const data = await s3.listObjectsV2(opts).promise();
          opts.ContinuationToken = data.NextContinuationToken;
          allKeys = allKeys.concat(data.Contents);
        } while (opts.ContinuationToken);
      };
      await listAllKeys(options);

      //Get unUsedList
      const unUsedLists = allKeys
        .filter((elem) => !usedLists.includes(elem.Key))
        .map((elem) => ({
          Key: elem.Key,
        }));
      console.log("Unused Lists:", unUsedLists);

      //Delete from s3 bucket
      if (unUsedLists.length) {
        const deleteOptions = {
          Bucket: process.env.S3_BUCKET,
          Delete: {
            Objects: unUsedLists,
          },
        };
        let result = await s3.deleteObjects(deleteOptions).promise();
        console.log(result);
      }
      return res.status(500).json({ success: true });
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
