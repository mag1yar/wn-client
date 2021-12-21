import React from "react"
import styles from "./Auth.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faSignInAlt } from "@fortawesome/free-solid-svg-icons"

import { MainForm, LoginForm, SignUpForm } from "./forms"
import { Dialog, Paper, Typography } from "@mui/material"

const Auth = (props: any) => {
    const { close, open } = props
    const [formType, setFormType] = React.useState<"main" | "login" | "signup">("main")

    return (
        <Dialog
            open={open}
            onClose={() => {
                close(false)
                setFormType("main")
            }}
        >
            <Paper elevation={16} className={styles.modal}>
                <div className={styles.modal__login}>
                    <Typography variant="h6" color="inherit" className={styles.modal__login_title}>
                        {formType === "main" ? (
                            <>
                                <FontAwesomeIcon icon={faSignInAlt} />
                                Вход на WN
                            </>
                        ) : (
                            <p
                                onClick={() => {
                                    setFormType("main")
                                }}
                                className={styles.modal__login_title_back}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} />
                                Вернуться
                            </p>
                        )}
                    </Typography>
                    {formType === "main" && <MainForm onOpenLogin={() => setFormType("login")} />}
                    {formType === "login" && <LoginForm onOpenSignUp={() => setFormType("signup")} />}
                    {formType === "signup" && <SignUpForm onOpenLogin={() => setFormType("login")} />}
                </div>
            </Paper>
        </Dialog>
    )
}

export default Auth
