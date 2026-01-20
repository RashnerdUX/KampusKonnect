export interface FormInputBaseProps {
    label: string;
    name: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
}

type TextInputProps = FormInputBaseProps & {
  type: 'text' | 'email' | 'tel' | 'password'
  placeholder?: string
  defaultValue?: string
}

type TextAreaProps = FormInputBaseProps & {
  type: 'textarea'
  rows?: number
  defaultValue?: string
  placeholder?: string
}

type SelectProps = FormInputBaseProps & {
  type: 'select'
  defaultValue?: string
  options: { label: string; value: string }[]
}

export type FormFieldProps =
  | TextInputProps
  | TextAreaProps
  | SelectProps



const CustomFormInput = (props: FormFieldProps) => {
  return (
    <div>
        {/* Label is universal */}
        <label className='block text-sm font-medium mb-2'>{props.label}</label>

        {/* When it is text */}
        {(props.type === 'text' || props.type === 'email' || props.type === 'tel' || props.type === 'password') && (
          <input
            type={props.type}
            name={props.name}
            defaultValue={props.defaultValue}
            className='w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder={props.placeholder}
            required={props.required}
          />
        )}

        {/* When it is textarea */}
        {props.type === 'textarea' && (
          <textarea
            name={props.name}
            defaultValue={props.defaultValue}
            rows={props.rows}
            className='w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder={props.placeholder}
            required={props.required}
          />
        )}

        {/* When it is select */}
        {props.type === 'select' && (
          <select
            name={props.name}
            defaultValue={props.defaultValue}
            className='w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary'
            required={props.required}
          >
            {props.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
    </div>
  )
}

export default CustomFormInput;