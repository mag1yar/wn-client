import { Visibility, VisibilityOff } from "@mui/icons-material"
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select as MuiSelect } from "@mui/material"
import React from "react"
import { useFormContext } from "react-hook-form"
import { FormFieldProps } from "../FormField"

type SelectProps = { defaultValue?: string | null; disableNone?: boolean; children: React.ReactNode } & FormFieldProps

const Select: React.FC<SelectProps> = (props) => {
    const { name, label, size, className, disabled, disableNone, fullWidth, defaultValue, sx, children } = props
    const { register, formState } = useFormContext()

    return (
        <>
            <FormControl disabled={disabled} fullWidth={fullWidth} sx={sx} className={className} size={size}>
                <InputLabel id={`${name}-label`}>{label}</InputLabel>
                <MuiSelect {...register(name)} labelId={`${name}-label`} id={`select-${name}`} label={label} defaultValue={defaultValue}>
                    {!disableNone && <MenuItem value="">Не выбрано</MenuItem>}
                    {children}
                </MuiSelect>
                <FormHelperText error={formState.errors[name]?.message}>{formState.errors[name]?.message}</FormHelperText>
            </FormControl>
        </>
    )
}

export default Select
