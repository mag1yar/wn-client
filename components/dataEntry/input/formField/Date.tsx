import { DesktopDatePicker, MobileDatePicker } from "@mui/lab"
import { TextField, useMediaQuery } from "@mui/material"
import moment, { Moment } from "moment"
import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { FormFieldProps } from "../FormField"

type DateProps = {
    name: string
    max?: Date
    min?: Date
    className?: string
} & FormFieldProps

const Date: React.FC<DateProps> = (props) => {
    const { name, label, size, className, disabled, fullWidth, sx } = props
    const { register, formState, control } = useFormContext()
    const [value, setValue] = React.useState<Moment>(moment())
    // const matches = useMediaQuery("(min-width:600px)")
    const handleChange = (date: Moment, field: any) => {
        field.onChange(date)
        setValue(date)
    }
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <DesktopDatePicker
                        {...register(name)}
                        className={className}
                        disabled={disabled}
                        views={["year"]}
                        label={label}
                        value={value}
                        onChange={(date: Moment) => handleChange(date, field)}
                        renderInput={(params) => <TextField size={size} fullWidth={fullWidth} {...params} />}
                    />
                )}
            />
            {/* <MobileDatePicker
                label="Date mobile"
                inputFormat="MM/dd/yyyy"
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
            /> */}
        </>
    )
}

export default Date
