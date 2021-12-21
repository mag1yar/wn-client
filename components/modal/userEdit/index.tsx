import { Box, Button, Dialog, MenuItem, Paper } from "@mui/material"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Api } from "../../../redux/api"
import { ChapterDto, UpdateChapterDto } from "../../../redux/types/chapters"
import FormField from "../../dataEntry/input/FormField"
import { Delete as DeleteIcon } from "@mui/icons-material"
import { useSnackbar } from "notistack"
import { useRouter } from "next/router"
import moment from "moment"
import { UpdateUserDto, UserDto } from "../../../redux/types/users"

interface UserEditProps {
    user: UserDto
    open: boolean
    onClose: (value: boolean) => void
}

const UserEdit: React.FC<UserEditProps> = (props) => {
    const { user, open, onClose } = props
    const router = useRouter()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const form = useForm({
        defaultValues: React.useMemo(() => {
            return user
        }, [user]),
    })
    React.useEffect(() => {
        form.reset(user)
    }, [user, form])

    if (!user) return <></>

    const onSubmit = async (dto: UpdateUserDto) => {
        try {
            const response = await Api().users.update(user?.id || 0, { login: dto.login, email: dto.email, role: dto.role, locked: dto.locked })
            enqueueSnackbar("Пользователь изменён", { variant: "success" })
            router.push(`/admin/users`)
            onClose(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" })
        }
    }

    const onDelete = async () => {
        try {
            const response = await Api().users.delete(user?.id || 0)
            enqueueSnackbar("Пользователь удалён", { variant: "success" })
            router.push(`/admin/users`)
            onClose(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" })
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
                        <FormField name="login" label="Логин" fullWidth disabled />
                        <FormField name="email" label="Электронная почта" type="email" disabled fullWidth sx={{ mb: 1, mt: 1 }} />
                        <FormField.Select name="role" label="Роль" defaultValue={user.role} disableNone fullWidth>
                            <MenuItem value="reader">Читатель</MenuItem>
                            <MenuItem value="author">Автор</MenuItem>
                            <MenuItem value="moder">Модератор</MenuItem>
                            <MenuItem value="admin">Админ</MenuItem>
                        </FormField.Select>
                        <FormField.Checkbox name="locked" label="Заблокирован" />
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <Button variant="outlined" color="error" onClick={() => onDelete()}  startIcon={<DeleteIcon />}>
                                Удалить
                            </Button>
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

export default UserEdit
