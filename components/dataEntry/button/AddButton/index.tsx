import styles from "./AddButton.module.scss"

import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { Paper, Typography } from "@mui/material"

interface AddButtonProps {
    href: string
}

const AddButton: React.FC<AddButtonProps> = (props) => {
    const { href } = props
    return (
        <Link href={href} passHref>
            <a>
                <Paper className={styles.button} elevation={6}>
                    <span className={styles.button__center}>
                        <FontAwesomeIcon icon={faPlus} className={styles.button__icon} />
                        <Typography sx={{ mt: 3 }}>Добавить</Typography>
                    </span>
                </Paper>
            </a>
        </Link>
    )
}

export default AddButton
