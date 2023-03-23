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
  value?: any
}

export const SelectField = ({
  options,
  placeholder,
  title,
  onChange,
  errorText,
  value,
}: SelectFieldProps) => {
  const item = !!value && options.find((option) => option.value == value)

  return (
    <div className="w-full">
      <p className="text-[14px] leading-[15px] font-[500] text-[#0D1011] font-[Montserrat] mb-1 1bp:text-[16.5px]">
        {title}
      </p>
      <Select
        className="w-full rounded-full text-[12px] font-[Poppins] mt-3"
        onChange={onChange}
        options={options}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: '9999px',
            height: '45px',
          }),
        }}
        placeholder={placeholder}
        value={!!value && item}
      />
      <p className="text-red-500 font-bold text-[12px]">{errorText}</p>
    </div>
  )
}
