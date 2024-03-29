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

export const IsSameDate = (first: Date, last: Date) => {
  const firstDate = first.getDate()
  const lastDate = last.getDate()
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
  return `${isDay ? hour : hour - 12} : ${minutes} ${isDay ? 'AM' : 'PM'}`
}
