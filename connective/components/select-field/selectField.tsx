import React from 'react'
import Select, { ActionMeta, OnChangeValue } from 'react-select'

type SelectFieldProps = {
  options: { value: number | string; label: string }[]
  placeholder: string
  title: string
  onChange: (
    newValue: OnChangeValue<any, any>,
    actionMeta: ActionMeta<any>,
  ) => void
  errorText: string
}

export const SelectField = ({
  options,
  placeholder,
  title,
  onChange,
  errorText,
}: SelectFieldProps) => {
  return (
    <div className="w-full">
      <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-1 1bp:text-[16.5px]">
        {title}
      </p>
      <Select
        className="w-full rounded-full text-[12px] font-[Poppins]"
        onChange={onChange}
        options={options}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: '9999px',
          }),
        }}
        placeholder={placeholder}
      />
      <p className="text-red-500 font-bold text-[12px]">{errorText}</p>
    </div>
  )
}
