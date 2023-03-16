export enum AccountType {
  BUSINESS = 'business',
  INDIVIDUAL = 'individual',
}

export type DiscoverUser = {
  id: number
  show_on_discover: boolean
  email: string
  industry: number
  username: string
  logo: string
  description: string
  status: string
  typename: 'DiscoverUser'
}

export type User = {
  id: number
  username: string
  password_hash: string
  email: string
  type: string
  email_verified: boolean
  stripeID: string
  show_on_discover: boolean
  verification_id: string
  verification_timestamp: string
  verify_email_otp: string
  send_code_attempt: number
  last_code_sent_time: string
  is_signup_with_google: boolean
  google_access_token: string
  industry?: string
  description?: string
  logo?: string
  status?: string
  typename: 'User'
}

export type ListItem = {
  id: number
  creator: number
  title: string
  description: string
  location: string
  list_obtained: string
  price: number
  url: string
  preview_url: string
  published: boolean
  cover_url: string
  category: number
  created_at: string
  buyer_id?: number
  buyers?: number
  logo?: string
  username?: string
  typename: 'ListItem'
}

export type Message = {
  id?: number
  sender: number
  receiver?: number
  text: string
  read?: boolean
  notified?: boolean
  timestamp?: string
  typename: 'Message'
}

export type UnreadNotification = {
  id: number
  email: string
  typename: 'UnreadNotification'
}

export type Conversation = {
  id: number
  email: string
  username: string
  location: string
  logo: string
  unread?: number
  timestamp?: string
  typename: 'Conversation'
}

export type StripePrice = {
  price: number
  stripeID: string
  typename: 'StripePrice'
}

export type Business = {
  id: number
  user_id: number
  company_name: string
  description: string
  logo: string
  website: string
  location: string
  industry: number
  size: string
  profileViews: number
  listViews: number
  status: string
  is_subscribed: boolean
  typename: 'Business'
}

export type Individual = {
  id: number
  user_id: number
  name: string
  bio: string
  profile_picture: string
  location: string
  profileViews: number
  listViews: number
  status: string
  is_subscribed: boolean
  typename: 'Individual'
  industry: string
  occupation: string
}

export type Occupation = {
  id: number
  name: string
  typename: 'Occupation'
}

export type Industry = {
  id: number
  name: string
  occupations: Occupation[]
  typename: 'Industry'
}

export type TruncatedUser = {
  id: number
  user_id: number
  name: string
  email: string
}

export type EmailContent = {
  subject: string
  msg: string
  typename: 'EmailContent'
}

export interface IValidationItem {
  name: string
  success: boolean
  error?: string
  typename: 'IValidationItem'
}

export class ValidationResponse {
  success: boolean
  fields: IValidationItem[]
  typename: 'ValidationResponse'

  constructor() {
    this.success = true
    this.fields = []
  }

  getFieldByName(name: string) {
    return this.fields.filter((field) => field.name === name)[0]
  }

  invalidateField(name: string, error: string) {
    let field = this.getFieldByName(name)
    field.success = false
    field.error = error
    this.success = false
  }
}
