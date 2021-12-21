import { Visibility, VisibilityOff } from "@mui/icons-material"
import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from "@mui/material"
import React from "react"
import { useFormContext } from "react-hook-form"
import { FormFieldProps } from "../FormField"

type CheckboxProps = { checked?: boolean } & FormFieldProps

const Checkbox: React.FC<CheckboxProps> = (props) => {
    const { name, label, size, className, disabled, fullWidth, checked, sx } = props
    const { register, formState } = useFormContext()

    return (
        <>
            {/* <FormControl disabled={disabled} fullWidth={fullWidth} sx={sx} className={className} size={size}></FormControl> */}
            <FormControlLabel control={<MuiCheckbox {...register(name)} size={size} />} label={label} checked={checked} disabled={disabled} />
        </>
    )
}

export default Checkbox
