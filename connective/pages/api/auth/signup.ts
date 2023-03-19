import { DAO } from '../../../lib/dao'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import bcrypt from 'bcryptjs'
import {
  AuthApiResponse,
  IApiResponseError,
} from '../../../types/apiResponseTypes'
import { ActivityFeed } from '../../../services/activity/activityFeed'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { username, email, password, is_subscribed } = req.body

    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(password, salt)

    var user = await DAO.Users.getByEmail(email) //Will return false if user does not exist, or a User object if they do exist

    if (user) {
      res.status(500).json({
        success: false,
        error: 'Email already exists',
      } as IApiResponseError)
    } else if (typeof user == 'boolean') {
      const stripe_account = await stripe.accounts.create({ type: 'express' })

      let userID = await DAO.Users.add(
        username,
        hash,
        email,
        stripe_account.id,
        is_subscribed,
      )
      await ActivityFeed.Auth.handleAuth(
        'user_signup',
        `user ${userID} has signed up`,
      )
      res.status(200).json({ success: true } as AuthApiResponse.ISignup)
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success: false,
      error: e,
      type: 'ISignup',
    } as AuthApiResponse.ISignup)
  }
}
