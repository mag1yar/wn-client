import { Send as SendIcon } from "@mui/icons-material"
import { Avatar, Box, Button, Input, SxProps } from "@mui/material"
import React from "react"
import { UserDto } from "../../redux/types/users"
import getServerImage from "../../utils/serverImage"

interface CommentAnswerProps {
    avatarSize: "small" | "medium" | "large"
    userData: UserDto | any
    open?: boolean
    setOpen: (value: boolean) => void
    sx?: SxProps
}

const CommentAnswer: React.FC<CommentAnswerProps> = (props) => {
    const { userData, open, setOpen, avatarSize, sx } = props

    const getAvatarSize = () => {
        let size = 24
        switch (avatarSize) {
            case "small":
                size = 24
                break
            case "medium":
                size = 36
                break
            case "large":
                size = 48
                break
        }
        return size
    }

    const size = getAvatarSize()

    return open ? (
        <Box sx={sx}>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                {userData.image ? (
                    <Avatar alt={userData.login} src={getServerImage(userData.image)} />
                ) : (
                    <Avatar sx={{ width: size, height: size, mr: 1 }}>{userData.login[0].toUpperCase()}</Avatar>
                )}
                <Input
                    sx={{ width: "100%" }}
                    multiline
                    autoFocus
                    // value={name}
                    // onChange={(e) => setName(e.target.value)}
                    // placeholder="Глава..."
                />
            </Box>
            <Box sx={{ mt: 1, float: "right" }}>
                <Button color="inherit" onClick={() => setOpen(false)} sx={{ mr: 1 }}>
                    Отмена
                </Button>
                <Button variant="contained" onClick={() => setOpen(false)} endIcon={<SendIcon />}>
                    Ответить
                </Button>
            </Box>
        </Box>
    ) : (
        <></>
    )
}

export default CommentAnswer
