import React from "react"
import styles from "../Auth.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { faGoogle, faVk } from "@fortawesome/free-brands-svg-icons"
import { Button } from "@mui/material"

interface MainFormProps {
    onOpenLogin: () => void
}

const MainForm: React.FC<MainFormProps> = ({ onOpenLogin }) => {
    return (
        <>
            <div className={styles.modal__login_buttons}>
                <Button variant="outlined" color="inherit" startIcon={<FontAwesomeIcon icon={faUserCircle} />} fullWidth onClick={onOpenLogin}>
                    Через почту
                </Button>
                <Button variant="outlined" color="inherit" startIcon={<FontAwesomeIcon icon={faVk} />} fullWidth disabled>
                    ВКонтакте
                </Button>
                <Button variant="outlined" color="inherit" startIcon={<FontAwesomeIcon icon={faGoogle} />} fullWidth disabled>
                    Google
                </Button>
            </div>
        </>
    )
}
export default MainForm
