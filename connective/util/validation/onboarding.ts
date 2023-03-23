import { ValidationResponse } from '../../types/types'

export function business(
  name: string,
  size: string,
  industry: number | string,
  occupation: string,
  description: string,
  status: string,
): ValidationResponse {
  let res = new ValidationResponse()

  res.fields = [
    { name: 'name', success: true, typename: 'IValidationItem' },
    { name: 'size', success: true, typename: 'IValidationItem' },
    { name: 'industry', success: true, typename: 'IValidationItem' },
    { name: 'occupation', success: true, typename: 'IValidationItem' },
    { name: 'description', success: true, typename: 'IValidationItem' },
    { name: 'status', success: true, typename: 'IValidationItem' },
  ]

  if (name == '') {
    res.invalidateField('name', 'You must enter a name.')
  }
  if (size == '') {
    res.invalidateField('size', 'You must select your company size.')
  }
  if (industry == '') {
    res.invalidateField('industry', 'You must select an industry.')
  }
  if (occupation == '') {
    res.invalidateField('occupation', 'You must select an occupation.')
  }
  if (description.length > 500) {
    res.invalidateField(
      'description',
      'Description must be less than 500 characters.',
    )
  }
  if (description == '') {
    res.invalidateField('description', 'You must enter a description.')
  }
  if (status == '') {
    res.invalidateField('status', 'You must select a status.')
  }

  return res
}

export function individual(
  name: string,
  description: string,
  industry: number | string,
  occupation: string,
  status: string,
): ValidationResponse {
  let res = new ValidationResponse()

  res.fields = [
    { name: 'name', success: true, typename: 'IValidationItem' },
    { name: 'description', success: true, typename: 'IValidationItem' },
    { name: 'industry', success: true, typename: 'IValidationItem' },
    { name: 'occupation', success: true, typename: 'IValidationItem' },
    { name: 'status', success: true, typename: 'IValidationItem' },
  ]

  if (name == '') {
    res.invalidateField('name', 'You must enter a name.')
  }
  if (industry == '') {
    res.invalidateField('industry', 'You must select an industry.')
  }
  if (occupation == '') {
    res.invalidateField('occupation', 'You must select an occupation.')
  }
  if (description.length > 500) {
    res.invalidateField('description', 'Bio must be less than 500 characters.')
  }
  if (description == '') {
    res.invalidateField('description', 'You must enter a bio.')
  }
  if (status == '') {
    res.invalidateField('status', 'You must select a status.')
  }

  return res
}

export const IsSameDate = (first: string, last: string) => {
  const firstDate = new Date(first).getDate()
  const lastDate = new Date(last).getDate()
  return firstDate === lastDate
}

export const getFormatDate = (date: Date) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const index = date.getMonth()
  return `${monthNames[index]} ${date.getDate()}`
}

export const getFormatTime = (date: Date) => {
  const [hour, minutes] = [date.getHours(), date.getMinutes()]
  const isDay = hour <= 12
  return `${isDay ? hour : '0' + (hour - 12)} : ${
    minutes < 10 ? '0' : ''
  }${minutes} ${isDay ? 'AM' : 'PM'}`
}

export const validateEmail = (email: string) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
}

export const statusOptions = [
  {
    value: 'Looking to give client for commission.',
    label: 'Looking to give client for commission.',
  },
  {
    value: 'Looking to get client for a commission.',
    label: 'Looking to get client for a commission.',
  },
  {
    value: 'Looking to expand my network',
    label: 'Looking to expand my network',
  },
]
