import { TextField } from "@mui/material"
import { SxProps } from "@mui/system"
import React from "react"
import { useFormContext } from "react-hook-form"
import Checkbox from "./formField/Checkbox"
import Date from "./formField/Date"
import MultipleSelect from "./formField/MultipleSelect"
import Password from "./formField/Password"
import Select from "./formField/Select"

export type FormFieldProps = {
    name: string
    label: string
    autoFocus?: boolean
    size?: "small" | "medium" | undefined
    className?: string
    disabled?: boolean
    fullWidth?: boolean
    sx?: SxProps
    multiline?: boolean
    type?: React.HTMLInputTypeAttribute | undefined
}

const FormField: React.FC<FormFieldProps> & {
    Password: typeof Password
    MultipleSelect: typeof MultipleSelect
    Select: typeof Select
    Date: typeof Date
    Checkbox: typeof Checkbox
} = (props) => {
    const { name, label, autoFocus, size, className, disabled, fullWidth, sx, multiline, type } = props
    const { register, formState } = useFormContext()
    return (
        <TextField
            {...register(name)}
            name={name}
            sx={sx}
            type={type}
            variant="outlined"
            label={label}
            fullWidth={fullWidth}
            size={size}
            autoFocus={autoFocus}
            error={!!formState.errors[name]?.message}
            helperText={formState.errors[name]?.message}
            className={className}
            disabled={disabled}
            multiline={multiline}
        />
    )
}

FormField.Password = Password
FormField.MultipleSelect = MultipleSelect
FormField.Select = Select
FormField.Date = Date
FormField.Checkbox = Checkbox
export default FormField
