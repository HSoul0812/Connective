import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DAO } from '../../../lib/dao'
import Stripe from 'stripe'
import bcrypt from 'bcryptjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null)

export default (req: NextApiRequest, res: NextApiResponse<Response>) =>
  NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: 'connective',
    callbacks: {
      async signIn({ account, profile }) {
        console.log(account)
        if (account.provider != ('google' || 'facebook')) return false

        const name = profile.name
        const email = profile.email
        const accessToken = account.access_token

        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(accessToken, salt)

        let user = await DAO.Users.getByEmail(email)
        if (typeof user != 'boolean') {
          if (user.is_signup_with_google) {
            await DAO.Users.updatePasswordHash(hash, email)
          } else {
            return `/auth/signin?error=true`
          }
        } else {
          const stripe_account = await stripe.accounts.create({
            type: 'express',
          })
          DAO.Users.add(name, hash, email, stripe_account.id, true, true)
        }

        return `/auth/signin?token=${accessToken}&email=${email}`
      },
    },
  })
