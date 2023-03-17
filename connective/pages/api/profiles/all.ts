import type { NextApiRequest, NextApiResponse } from 'next'
import { DAO } from 'lib/dao'
import { ProfileApiResponse, IApiResponseError } from 'types/apiResponseTypes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method == 'GET') {
      let users = await DAO.Users.getAll()
      res.status(200).json({ users } as ProfileApiResponse.IProfiles)
    }
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ success: false, error: e } as IApiResponseError)
  }
}
