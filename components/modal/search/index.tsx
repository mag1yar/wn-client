import React from "react"
import styles from "./Search.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faSignInAlt } from "@fortawesome/free-solid-svg-icons"

import { Box, Dialog, List, ListItem, ListItemButton, ListItemText, Paper, Tab, Tabs, Typography } from "@mui/material"
import SearchInput from "../../dataEntry/input/Search"
import Link from "next/link"
import { SearchNovelsDto } from "../../../redux/types/novels"
import { Api } from "../../../redux/api"

const Search = (props: any) => {
    const { close, open } = props

    const [searchType, setSearchType] = React.useState(0) // 0: novels, 1: users
    const changeSearchType = (event: React.SyntheticEvent, value: number) => {
        setSearchType(value)
        setSearchValue("")
        setFounds([])
    }

    const [searchValue, setSearchValue] = React.useState("")
    const [founds, setFounds] = React.useState([])
    
    const changeSearchValue = async (e: any) => {
        const { value } = e.target
        setSearchValue(value)
        if (value.length >= 2) {
            try {
                switch (searchType) {
                    case 0:
                        const { items } = await Api().novels.getSearch({ name: value })
                        setFounds(items)
                        break

                    default:
                        break
                }
            } catch (err) {}
        } else setFounds([])
    }

    return (
        <Dialog
            open={open}
            onClose={() => {
                close(false)
                // setSearchType("novels")
            }}
            maxWidth="sm"
            fullWidth
        >
            <SearchInput value={searchValue} onChange={changeSearchValue} />
            <Paper elevation={16} className={styles.modal}>
                <Tabs textColor="inherit" value={searchType} onChange={changeSearchType} centered>
                    <Tab label="Новеллы" />
                    <Tab label="Пользователи" />
                </Tabs>
                {/* <Box sx={{ p: 1 }}> */}
                {founds.length > 0 && (
                    <Paper square>
                        <List>
                            {founds.map((obj: any) => (
                                <ListItem key={obj.id} disablePadding>
                                    <Link href={`/${obj.id}`} passHref>
                                        <ListItemButton>
                                            <ListItemText primary={obj.name} secondary={obj.country} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
                {/* </Box> */}
            </Paper>
        </Dialog>
    )
}

export default Search
