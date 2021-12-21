import styled from "@emotion/styled"
import { alpha, InputBase } from "@mui/material"

import { Search as SearchIcon } from "@mui/icons-material"
import React from "react"

const Search = styled("div")(({ theme }: any) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: "100%",
}))

const SearchIconWrapper = styled("div")(({ theme }: any) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }: any) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        // transition: theme.transitions.create("width"),
        width: "100%",
    },
}))

interface SearchProps {
    placeholder?: string
    value?: any
    onChange?: any
}

const SearchInput: React.FC<SearchProps> = (props) => {
    const { placeholder, value, onChange } = props
    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase autoFocus value={value} onChange={onChange} placeholder={placeholder} inputProps={{ "aria-label": "search" }} />
        </Search>
    )
}

export default SearchInput
