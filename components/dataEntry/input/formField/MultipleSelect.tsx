import {
    Box,
    Checkbox,
    Chip,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select as MuiSelect,
    SelectChangeEvent,
} from "@mui/material"
import React from "react"
import { useFormContext } from "react-hook-form"
import { FormFieldProps } from "../FormField"
import _without from "lodash/without"
import { Cancel as CancelIcon } from "@mui/icons-material"

type MultipleSelectProps = { list: [] } & FormFieldProps

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

const MultipleSelect: React.FC<MultipleSelectProps> = (props) => {
    const { name, label, size, className, disabled, fullWidth, sx, list } = props
    const { register, formState } = useFormContext()

    const [chip, setChip] = React.useState<string[]>([])
    const handleChange = (event: SelectChangeEvent<typeof chip>) => {
        const {
            target: { value },
        } = event
        setChip(typeof value === "string" ? value.split(",") : value)
    }
    const handleDelete = (value: string) => {
        setChip((chips) => chips.filter((c) => c !== value))
    }
    
    return (
        <>
            <FormControl disabled={disabled} fullWidth={fullWidth} sx={sx} className={className} size={size} >
                <InputLabel id={`${name}-label`}>{label}</InputLabel>
                <MuiSelect
                    {...register(name)}
                    multiple
                    labelId={`${name}-label`}
                    id={`multiple-select-${name}`}
                    label={label}
                    value={chip}
                    onChange={handleChange}
                    // input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip
                                    key={value}
                                    color="primary"
                                    label={value}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    deleteIcon={<CancelIcon onMouseDown={(e) => e.stopPropagation()} />}
                                    onClick={() => handleDelete(value)}
                                    onDelete={() => handleDelete(value)}
                                />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {list.map(
                        (data) =>
                            !(chip.indexOf(data) > -1) && (
                                <MenuItem key={data} value={data}>
                                    <Checkbox checked={chip.indexOf(data) > -1} />
                                    <ListItemText primary={data} />
                                </MenuItem>
                            )
                    )}
                </MuiSelect>
                <FormHelperText error={formState.errors[name]?.message}>{formState.errors[name]?.message}</FormHelperText>
            </FormControl>
        </>
    )
}

export default MultipleSelect
