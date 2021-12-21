import { Box, Button, Dialog, MenuItem, Paper } from "@mui/material"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Api } from "../../../redux/api"
import { ChapterDto, UpdateChapterDto } from "../../../redux/types/chapters"
import FormField from "../../dataEntry/input/FormField"
import { Delete as DeleteIcon, DisabledByDefault } from "@mui/icons-material"
import { useSnackbar } from "notistack"
import { useRouter } from "next/router"
import moment from "moment"
import Restrict from "../../permission/Restrict"
import { SCOPES } from "../../permission/permissions"

interface ChapterEdit {
    chapter: ChapterDto
    open: boolean
    onClose: (value: boolean) => void
}

const ChapterEdit: React.FC<ChapterEdit> = (props) => {
    const { chapter, open, onClose } = props
    const router = useRouter()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const form = useForm({
        defaultValues: React.useMemo(() => {
            return chapter
        }, [chapter]),
    })
    React.useEffect(() => {
        form.reset(chapter)
    }, [chapter, form])
    // React.useEffect(() => {
    //     if (chapter) {
    //         form.setValue([{ name: chapter.name }, { status: chapter.status }])
    //     }
    // }, [chapter])
    if (!chapter) return <></>

    const onSubmit = async (dto: UpdateChapterDto) => {
        try {
            const response = await Api().chapters.update(chapter?.id || 0, { name: dto.name, status: dto.status, updatedAt: moment() })
            enqueueSnackbar("Глава изменена", { variant: "success" })
            router.push(`/novel/${chapter.novelId}`)
            onClose(false)
        } catch (err: any) {
            enqueueSnackbar("Мы не смогли изменить главу", { variant: "error" })
        }
    }

    const onDelete = async () => {
        try {
            const response = await Api().chapters.delete(chapter?.id || 0)
            enqueueSnackbar("Глава удалена", { variant: "success" })
            router.push(`/novel/${chapter.novelId}`)
            onClose(false)
        } catch (err: any) {
            enqueueSnackbar("Мы не смогли удалить главу", { variant: "error" })
        }
    }

    return (
        <Dialog
            open={open}
            onClose={() => {
                onClose(false)
            }}
            maxWidth="sm"
        >
            <Paper elevation={16} sx={{ p: 1 }}>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField name="name" label="Название" fullWidth />
                        <FormField.Select name="status" label="Статус" defaultValue={chapter.status} disableNone fullWidth sx={{ mb: 1, mt: 1 }}>
                            <MenuItem value="edit">Редактируется</MenuItem>
                            <MenuItem value="ready">Готово</MenuItem>
                        </FormField.Select>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <Restrict scopes={[SCOPES.deleteUser]} errorProps={{ disabled: true }}>
                                <Button variant="outlined" color="error" onClick={() => onDelete()} startIcon={<DeleteIcon />}>
                                    Удалить
                                </Button>
                            </Restrict>
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button variant="contained" color="primary" type="submit">
                                Сохранить
                            </Button>
                        </Box>
                    </form>
                </FormProvider>
            </Paper>
        </Dialog>
    )
}

export default ChapterEdit
