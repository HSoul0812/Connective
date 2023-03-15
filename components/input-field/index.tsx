import Image from 'next/image'
import dollarIcon from '../../public/assets/dollar.svg'

type Props = {
  name: string
  placeholder?: string
  password?: boolean
  textarea?: boolean
  price?: boolean
  updateValue: (value: string) => void
  errorText?: string
  value?: string | number
  disabled?: boolean
}

const InputField = ({
  name,
  placeholder,
  password,
  textarea,
  price,
  updateValue,
  errorText,
  value,
  disabled,
}: Props) => {
  return (
    <div className="flex flex-col w-[100%]">
      <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-3 1bp:text-[16.5px]">
        {name}
      </p>
      {price && (
        <div className="relative flex items-center">
          <div className="absolute z-[10] pl-[12px] my-auto flex items-center">
            <Image
              src={dollarIcon}
              alt="Search icon"
              width="17.5px"
              height="17.5px"
            />
          </div>
          <input
            disabled={disabled}
            onChange={(e) => {
              updateValue(e.target.value)
            }}
            type="number"
            min="0"
            step="1"
            className="outline-none w-full pl-[32px] pr-[14px] text-[14px] h-[47px] border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"
            value={value}
            placeholder={placeholder}
          ></input>
        </div>
      )}

      {textarea && (
        <textarea
          onChange={(e) => {
            updateValue(e.target.value)
          }}
          className="outline-none w-full px-[14px] text-[14px] h-[47px] border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"
          placeholder={placeholder}
          value={value}
        ></textarea>
      )}

      {!textarea && !price && (
        <input
          onChange={(e) => {
            updateValue(e.target.value)
          }}
          className="outline-none w-full px-[14px] text-[14px] h-[47px] border border-black/20 rounded-full focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"
          type={password ? 'password' : ''}
          placeholder={placeholder}
          value={value}
        ></input>
      )}

      {errorText && (
        <p className="text-red-500 font-bold text-[12px]">{errorText}</p>
      )}
    </div>
  )
}

export default InputField
