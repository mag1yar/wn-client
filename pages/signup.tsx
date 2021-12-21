import { yupResolver } from "@hookform/resolvers/yup/dist/yup"
import { LoadingButton } from "@mui/lab"
import { Button, ButtonGroup, Grid, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { setCookie } from "nookies"
import { useSnackbar } from "notistack"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import FormField from "../components/dataEntry/input/FormField"
import { MainLayout } from "../components/layouts/MainLayout"
import { Api } from "../redux/api"
import { useAppDispatch } from "../redux/hooks"
import { setUserData } from "../redux/reducers/users"
import { CreateUserDto } from "../redux/types/users"
import { SignUpFormSchema } from "../utils/validation"

const steps = [
    { label: "Логин", optional: false },
    { label: "Электронная почта", optional: false },
    { label: "Пароль", optional: false },
    { label: "Аватар", optional: true },
    // { label: "Выберите основной и дополнительные языки", optional: true },
]

const SignUp: NextPage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const form = useForm({ resolver: yupResolver(SignUpFormSchema), mode: "onChange" })
    console.log(form.formState.errors)
    const [loading, setLoading] = React.useState(false)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [activeStep, setActiveStep] = React.useState(0)
    const [skippedStep, setSkippedStep] = React.useState(new Set<number>())
    const lastStep = activeStep === steps.length - 1

    const handleNextStep = () => {
        let newSkipped = skippedStep
        if (skippedStep.has(activeStep)) {
            newSkipped = new Set(newSkipped.values())
            newSkipped.delete(activeStep)
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        setSkippedStep(newSkipped)
    }

    const handleSkipStep = () => {
        if (!steps[activeStep].optional) throw new Error("Вы не можете пропустить обьязательный шаг.")

        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        setSkippedStep((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values())
            newSkipped.add(activeStep)
            return newSkipped
        })
    }
    const handleBackStep = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return loginStep()
            case 1:
                return emailStep()
            case 2:
                return passwordStep()
        }
    }

    const loginStep = () => {
        return (
            <Grid item>
                <FormField name="login" label="Логин" autoFocus />
            </Grid>
        )
    }
    const emailStep = () => {
        return (
            <Grid item>
                <FormField name="email" type="email" label="Электронная почта" autoFocus />
            </Grid>
        )
    }
    const passwordStep = () => {
        return (
            <Grid item>
                <FormField.Password name="password" label="Пароль" autoFocus />
                <FormField.Password name="passwordConfirmation" label="Повторите пароль" />
            </Grid>
        )
    }

    const onSubmit = async (dto: CreateUserDto) => {
        try {
            setLoading(true)

            const data = new FormData()

            for (const key in dto) {
                data.append(key, dto[key])
            }
            console.log(dto)

            const user = await Api().users.signUp(data)
            setCookie(null, "token", user.token, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            })
            dispatch(setUserData(user))

            router.push(`/user/${user.id}`)
            enqueueSnackbar(`Добро пожаловать ${user.login}`, { variant: "success" })
        } catch (e) {
            console.warn("Error on create novel", e)
            enqueueSnackbar("Мы не смогли создать новеллу", { variant: "error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                {steps.map(({ label, optional }, index) => {
                    const stepProps: { completed?: boolean; optional?: React.ReactNode } = {}
                    if (optional) {
                        stepProps.optional = (
                            <Typography variant="caption" sx={{ display: "block", textAlign: "center" }}>
                                Необязательно
                            </Typography>
                        )
                    }
                    if (skippedStep.has(index)) stepProps.completed = false

                    return (
                        <Step key={label} completed={stepProps.completed}>
                            <StepLabel optional={stepProps.optional}>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
                    {activeStep === steps.length ? (
                        <Typography sx={{ mt: 2, mb: 1 }}>Аккаунт успешно создан.</Typography>
                    ) : (
                        <Grid container spacing={2} alignItems="center" justifyContent="center" direction="column">
                            {renderStep()}
                            <Grid item sx={{ width: "100%", mt: 5 }}>
                                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                    {activeStep !== 0 && (
                                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBackStep} sx={{ mr: 1 }}>
                                            Назад
                                        </Button>
                                    )}
                                    <Box sx={{ flex: "1 1 auto" }} />
                                    {steps[activeStep].optional && (
                                        <Button variant="text" color="inherit" onClick={handleSkipStep} sx={{ mr: 1 }}>
                                            Пропустить
                                        </Button>
                                    )}
                                    {lastStep ? (
                                        <LoadingButton variant="contained" loading={loading} loadingPosition="start" type="submit">
                                            Создать
                                        </LoadingButton>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                handleNextStep()
                                            }}
                                        >
                                            Продолжить
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </form>
            </FormProvider>
        </MainLayout>
    )
}

export default SignUp
