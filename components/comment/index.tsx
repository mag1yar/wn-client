import { Grid } from "@mui/material"
import React from "react"
import { useAppSelector } from "../../redux/hooks"
import { selectUserData } from "../../redux/reducers/users"
import CommentAnswer from "./CommentAnswer"
import CommentItem from "./CommentItem"
import { useSession } from "next-auth/react"

interface CommentProps {}

const Comment: React.FC<CommentProps> = (props) => {
    const {} = props

    const userData = useAppSelector(selectUserData)
    // const { data: session } = useSession()
    // const userData = session?.user

    return (
        <>
            <Grid></Grid>
            <CommentItem userData={userData} />
        </>
    )
}

export default Comment
