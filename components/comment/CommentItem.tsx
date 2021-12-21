import { Send as SendIcon, ThumbDown, ThumbDownAltOutlined, ThumbUp, ThumbUpOutlined } from "@mui/icons-material"
import { Avatar, Box, Button, Grid, Input, Typography } from "@mui/material"
import React from "react"
import { UserDto } from "../../redux/types/users"
import getServerImage from "../../utils/serverImage"
import CommentAnswer from "./CommentAnswer"
import styles from "./ComponentItem.module.scss"

interface CommentItemProps {
    userData: UserDto | any
}

const CommentItem: React.FC<CommentItemProps> = (props) => {
    const { userData } = props

    const [openAnswer, setOpenAnswer] = React.useState(false)
    const [like, setLike] = React.useState({ value: false, count: 0 })
    const [dislike, setDislike] = React.useState({ value: false, count: 0 })

    const handleLike = () => {
        if (like.value) {
            setLike({ value: false, count: like.count - 1 })
            return
        }
        setLike({ value: true, count: like.count + 1 })
        setDislike({ ...dislike, value: false })
    }
    const handleDislike = () => {
        if (dislike.value) {
            setDislike({ value: false, count: like.count })
            return
        }
        setDislike({ value: true, count: like.count - 1 })
        setLike({ ...like, value: false })
    }

    return (
        <Grid container wrap="nowrap" spacing={1}>
            <Grid item>
                <Grid container>
                    <Grid item padding={1}>
                        <Avatar>T</Avatar>
                    </Grid>
                    <Grid item padding={1}>
                        <Typography variant="subtitle2">Michel Michel</Typography>
                        <Typography variant="caption">1 день назад</Typography>
                    </Grid>
                </Grid>
                <Typography variant="caption" sx={{ textAlign: "center" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis bibendum ac ex vehicula laoreet.
                    Suspendisse congue vulputate lobortis. Pellentesque at interdum tortor. Quisque arcu quam, malesuada vel mauris et, posuere sagittis ipsum.
                    Aliquam ultricies a ligula nec faucibus. In elit metus, efficitur lobortis nisi quis, molestie porttitor metus. Pellentesque et neque risus.
                    Aliquam vulputate, mauris vitae tincidunt interdum, mauris mi vehicula urna, nec feugiat quam lectus vitae ex.
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Button color="inherit" size="small" startIcon={like.value ? <ThumbUp /> : <ThumbUpOutlined />} onClick={() => handleLike()}>
                        {like.count}
                    </Button>
                    <Button color="inherit" size="small" startIcon={dislike.value ? <ThumbDown /> : <ThumbDownAltOutlined />} onClick={() => handleDislike()}>
                        {dislike.count}
                    </Button>
                    <Button color="inherit" size="small" onClick={() => setOpenAnswer(true)}>
                        Ответить
                    </Button>
                </Box>
                <CommentAnswer open={openAnswer} setOpen={setOpenAnswer} avatarSize="small" userData={userData} />
            </Grid>
        </Grid>
    )
}

export default CommentItem
