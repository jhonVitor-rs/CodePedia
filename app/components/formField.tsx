import { useEffect, useState } from "react"
import { cn } from "~/lib/utils"

interface FormFieldProps {
  htmlFor: string
  label: string
  type?: string
  value: any
  onChange?: (...args: any) => any
  error?: string
  disable?: boolean
  className?: string
}

export function FormField({
  htmlFor,
  label,
  type = "text",
  value,
  onChange = () => { },
  error = "",
  disable = false,
  className
}: FormFieldProps) {
  const [errorText, setErrorText] = useState(error)

  useEffect(() => {
    setErrorText(error)
  }, [error])
  
  return (
    <div className={cn(className)}>
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
      </label>
      <input onChange={e => {
        onChange(e)
        setErrorText('')
      }} type={type} id={htmlFor} name={htmlFor} className="w-full p-2 rounded-xl my-2 text-slate-900" value={value} disabled={disable}
      />
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        {errorText || ''}
      </div>
    </div>
  )
}