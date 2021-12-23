import { LoadingButton } from "@mui/lab"
import { Button, ButtonGroup, Grid, MenuItem, Paper, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import type { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import UploadButton from "../components/dataEntry/button/UploadButton"
import FormField from "../components/dataEntry/input/FormField"
import { MainLayout } from "../components/layouts/MainLayout"
import { Api } from "../redux/api"
import { useAppSelector } from "../redux/hooks"
import { selectUserData } from "../redux/reducers/users"
import { CreateNovelDto } from "../redux/types/novels"
import genresList from "../utils/constants/genresList"
import tagsList from "../utils/constants/tagsList"
import { useSnackbar } from "notistack"
import { useSession } from "next-auth/react"
import { wrapper } from "../redux/store"
import { RestrictRoute } from "../components/permission/RestrictRoute"
import { ROLES } from "../components/permission/permissions"

const steps = [
    { label: "Информация", optional: false },
    { label: "Описание", optional: false },
]

const Add: NextPage = () => {
    const userData = useAppSelector(selectUserData)
    // const { data: session } = useSession()
    // const userData = session?.user

    const form = useForm()
    const router = useRouter()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [creating, setCreating] = React.useState(false)

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
                return renderInfoStep()
            case 1:
                return renderDescriptionStep()
        }
    }

    const renderInfoStep = () => {
        return (
            <Grid item container lg={12} md={12} sm={12} xs={12}>
                <Grid item lg={3} md={4} sm={6} xs={12} padding={1}>
                    <UploadButton name="picture" accept=".png, .jpg, .jpeg" />
                </Grid>
                <Grid item container lg={9} md={8} sm={6} xs={12}>
                    <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                        <FormField name="name" label="Название" fullWidth />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6} padding={1}>
                        <FormField.Select name="country" fullWidth label="Страна" defaultValue="kz">
                            <MenuItem value="kz">Казахстан</MenuItem>
                        </FormField.Select>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6} padding={1}>
                        <FormField.Date fullWidth name="releaseYear" label="Год релиза" />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                        <FormField.MultipleSelect name="genres" label="Жанры" fullWidth list={genresList} />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                        <FormField.MultipleSelect name="tags" label="Теги" fullWidth list={tagsList} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} padding={1}>
                        <FormField.Select name="status" disableNone fullWidth label="Статус" defaultValue="ongoing">
                            <MenuItem value="announce">Анонс</MenuItem>
                            <MenuItem value="ongoing">Онгоинг</MenuItem>
                            <MenuItem value="completed">Завершён</MenuItem>
                            <MenuItem value="abandoned">Заброшен</MenuItem>
                        </FormField.Select>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} padding={1}>
                        <FormField.Select name="ageRating" label="Возрастное ограничение" disableNone fullWidth defaultValue="">
                            <MenuItem value="">Нету</MenuItem>
                            <MenuItem value="16">16+</MenuItem>
                            <MenuItem value="18">18+</MenuItem>
                        </FormField.Select>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    const renderDescriptionStep = () => {
        return (
            <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                <FormField multiline name="description" label="Описание" fullWidth />
            </Grid>
        )
    }

    const onSubmit = async (dto: CreateNovelDto) => {
        try {
            setCreating(true)
            if (userData && userData.id) dto.authorId = userData.id
            else return

            const data = new FormData()

            for (const key in dto) {
                data.append(key, dto[key])
            }

            const novel = await Api()
                .novels.create(data)

            router.push(`/novel/${novel.id}`)
            enqueueSnackbar("Новелла создана", { variant: "success" })
        } catch (e) {
            console.warn("Error on create novel", e)
            enqueueSnackbar("Мы не смогли создать новеллу", { variant: "error" })
        } finally {
            setCreating(false)
        }
    }

    return (
        <MainLayout>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 10 }}>
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
                        // <Grid container spacing={2} alignItems="center" justifyContent="center" direction="column">
                        //     {renderStep()}
                        //
                        // </Grid>

                        <Grid container>
                            {renderStep()}
                            <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                    {activeStep !== 0 && (
                                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBackStep} sx={{ mr: 1 }}>
                                            Back
                                        </Button>
                                    )}
                                    <Box sx={{ flex: "1 1 auto" }} />
                                    <ButtonGroup>
                                        {steps[activeStep].optional && (
                                            <Button variant="outlined" color="inherit" onClick={handleSkipStep}>
                                                Пропустить
                                            </Button>
                                        )}
                                        {lastStep ? (
                                            <LoadingButton variant="contained" loading={creating} loadingPosition="start" type="submit">
                                                Создать
                                            </LoadingButton>
                                        ) : (
                                            <Button variant="contained" onClick={handleNextStep}>
                                                Продолжить
                                            </Button>
                                        )}
                                    </ButtonGroup>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </form>
            </FormProvider>
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) =>
    RestrictRoute(
        store,
        async (ctx) => {
            return { props: {} }
        },
        [ROLES.reader, ROLES.author, ROLES.moder, ROLES.admin]
    )
)

export default Add
