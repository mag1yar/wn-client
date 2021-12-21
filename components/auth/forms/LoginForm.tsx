import styles from "../Auth.module.scss"

import React from "react"
import { setCookie } from "nookies"

import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup/dist/yup"
import { LoginFormSchema } from "../../../utils/validation"

import { LoginDto } from "../../../redux/types/users"
import { setUserData } from "../../../redux/reducers/users"
import { useAppDispatch } from "../../../redux/hooks"
import { Api } from "../../../redux/api"

import { Box } from "@mui/system"
import { Button, Link, Typography } from "@mui/material"

import FormField from "../../dataEntry/input/FormField"
import Notification from "../../notification"
import { useSnackbar } from "notistack"

interface LoginFormProps {
    onOpenSignUp: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onOpenSignUp }) => {
    const dispatch = useAppDispatch()
    const form = useForm({ resolver: yupResolver(LoginFormSchema) })
    const [showErrorMessage, setShowErrorMessage] = React.useState(false)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const onSubmit = async (dto: LoginDto) => {
        try {
            const data = await Api().users.login(dto)
            if (data.locked) {
                enqueueSnackbar("Вы заблокированы", { variant: "warning" })
                return
            }
            setCookie(null, "token", data.token, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            })
            dispatch(setUserData(data))
            enqueueSnackbar("Успешная авторизация", { variant: "success" })
        } catch (err: any) {
            enqueueSnackbar("Неправильная почта или пароль", { variant: "error" })
            if (err.response) setShowErrorMessage(err.response.data.message)
        }
    }

    return (
        <>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={styles.modal__login_form}>
                    <FormField name="email" label="Почта" autoFocus className={styles.modal__login_form_input} />
                    <FormField.Password name="password" label="Пароль" className={styles.modal__login_form_input} />
                    <Box display="flex" justifyContent="space-between">
                        <Button variant="text" color="inherit">
                            Забыли?
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={form.formState.isSubmitting}>
                            Войти
                        </Button>
                    </Box>
                </form>
                <Typography variant="subtitle2" color="inherit" align="center" className={styles.modal__login_signup}>
                    Нет аккаунта?{" "}
                    <Link fontWeight={700} onClick={onOpenSignUp}>
                        Зарегестрируйтесь
                    </Link>
                </Typography>
            </FormProvider>
            {/* <Notification open={showErrorMessage} onClose={() => setShowErrorMessage(false)} severity="error" autoHideDuration={5000}>
                Ошибка
            </Notification> */}
        </>
    )
}
export default LoginForm
