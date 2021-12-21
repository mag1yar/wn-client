import { Visibility, VisibilityOff } from "@mui/icons-material"
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material"
import React from "react"
import { useFormContext } from "react-hook-form"
import { FormFieldProps } from "../FormField"

type PasswordProps = {} & FormFieldProps

const Password: React.FC<PasswordProps> = (props) => {
    const { name, label, size, className, disabled, fullWidth, sx } = props
    const { register, formState } = useFormContext()
    const [showPassword, setShowPassword] = React.useState(false)

    return (
        <>
            <FormControl variant="outlined" disabled={disabled} fullWidth={fullWidth} sx={sx} size={size} className={className}>
                <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
                <OutlinedInput
                    {...register(name)}
                    id={`outlined-adornment-${name}`}
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={label}
                />
                <FormHelperText error={formState.errors[name]?.message}>{formState.errors[name]?.message}</FormHelperText>
            </FormControl>
        </>
    )
}

export default Password
