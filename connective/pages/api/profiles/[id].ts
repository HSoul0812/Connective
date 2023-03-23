import { withIronSession } from 'next-iron-session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IApiResponseError, ProfileApiResponse } from 'types/apiResponseTypes'
import { DAO } from 'lib/dao'

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  try {
    // @ts-ignore
    let user = req.session.get().user
    if (typeof user == 'undefined') {
      return res
        .status(500)
        .json({ success: false, error: 'Not signed in' } as IApiResponseError)
    }
    if (req.method == 'GET') {
      //Returns callers account
      res.status(200).json({
        business: await DAO.Profile.getByUserId(Number(id)),
      })
      console.log('calling get profile api')
    }
  } catch (e) {
    console.log(e)
    return res.status(500).json({ success: false, error: e })
  }
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET || '',
  cookieName: 'Connective',
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
})
