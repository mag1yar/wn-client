import styles from "../Auth.module.scss"

import React from "react"
import { setCookie } from "nookies"

import { useAppDispatch } from "../../../../redux/hooks"
import { setUserData } from "../../../../redux/reducers/users"
import { CreateUserDto } from "../../../../redux/types/users"

import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup/dist/yup"
import { Api } from "../../../../redux/api"
import { SignUpFormSchema } from "../../../../utils/validation"

import { Button, Link, Typography } from "@mui/material"

import FormField from "../../../dataEntry/input/FormField"

interface SignUpFormProps {
    onOpenLogin: () => void
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onOpenLogin }) => {
    const dispatch = useAppDispatch()
    const form = useForm({ resolver: yupResolver(SignUpFormSchema) })

    const onSubmit = async (dto: CreateUserDto) => {
        try {
            const data = await Api().users.signUp(dto)
            setCookie(null, "token", data.token, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            })
            dispatch(setUserData(data))
        } catch (err) {
            console.warn("Error on signup", err)
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={styles.modal__login_form}>
                <FormField name="login" label="Логин" autoFocus className={styles.modal__login_form_input} />
                <FormField name="email" label="Почта" className={styles.modal__login_form_input} />
                <FormField.Password name="password" label="Пароль" className={styles.modal__login_form_input} />
                <FormField.Password name="passwordConfirmation" label="Повторите пароль" className={styles.modal__login_form_input} />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={form.formState.isSubmitting}>
                    Создать аккаунт
                </Button>
            </form>
            <Typography variant="subtitle2" color="inherit" align="center" className={styles.modal__login_signup}>
                Есть аккаунт?{" "}
                <Link fontWeight={700} onClick={onOpenLogin}>
                    Войдите
                </Link>
            </Typography>
        </FormProvider>
    )
}
export default SignUpForm
