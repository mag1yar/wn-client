import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { ArrowCircleRight as ArrowCircleRightIcon } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import moment from "moment"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import FontAwesomeMuiIcon from "../../components/icon/FontAwesomeMuiIcon"
import { AdminLayout } from "../../components/layouts/AdminLayout"
import UserEdit from "../../components/modal/userEdit"
import { ROLES } from "../../components/permission/permissions"
import { RestrictRoute } from "../../components/permission/RestrictRoute"
import { Api } from "../../redux/api"
import { useAppSelector } from "../../redux/hooks"
import { selectUserData } from "../../redux/reducers/users"
import { wrapper } from "../../redux/store"
import { UserDto } from "../../redux/types/users"

interface UsersProps {
    users: UserDto[]
}

const Users: NextPage<UsersProps> = (props) => {
    const { users } = props

    const router = useRouter()
    const [openUserEditModal, setOpenUserEditModal] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState({})
    const userData = useAppSelector(selectUserData)

    const canEdit = userData && userData.role === "admin"

    const tableColumns: GridColDef[] = [
        {
            field: "edit",
            headerName: "Редактировать",
            renderCell: (params) => (
                <IconButton
                    size="small"
                    onClick={() => {
                        setSelectedUser(params.row)
                        setOpenUserEditModal(true)
                    }}
                >
                    <FontAwesomeMuiIcon fontSize="inherit" icon={faEdit} />
                </IconButton>
            ),
            hideSortIcons: true,
            width: 10,
            disableColumnMenu: true,
            hide: !canEdit,
        },
        {
            field: "go",
            headerName: "Перейти",
            renderCell: (params) => (
                <IconButton size="small" onClick={() => router.push(`/user/${params.id}`)}>
                    <ArrowCircleRightIcon />
                </IconButton>
            ),
            hideSortIcons: true,
            width: 10,
            disableColumnMenu: true,
        },
        {
            field: "id",
            headerName: "ID",
            width: 50,
            disableColumnMenu: true,
            align: "center",
        },
        {
            field: "login",
            headerName: "Логин",
            width: 100,
            disableColumnMenu: true,
        },
        { field: "email", headerName: "Электронная почта", width: 200, disableColumnMenu: true },
        {
            field: "role",
            headerName: "Роль",
            width: 100,
            disableColumnMenu: true,
        },
        { field: "locked", headerName: "Заблокирован", hideSortIcons: true, width: 80, disableColumnMenu: true },
        {
            field: "createdAt",
            headerName: "Зарегестрирован с",
            hideSortIcons: true,
            width: 100,
            disableColumnMenu: true,
        },
        { field: "updatedAt", headerName: "Последнее изменение", hideSortIcons: true, minWidth: 150, disableColumnMenu: true },
    ]
    let tableRows = []
    for (let i = 0; i < users.length; i++) {
        const u = users[i]
        tableRows.push({ ...u, edit: u.id, go: u.id, createdAt: moment(u.createdAt).format("l"), updatedAt: moment(u.updatedAt).fromNow() })
    }

    return (
        <AdminLayout>
            <DataGrid rows={tableRows} columns={tableColumns} pageSize={40} density="compact" autoHeight hideFooterSelectedRowCount />
            <UserEdit open={openUserEditModal} onClose={setOpenUserEditModal} user={selectedUser} />
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) =>
    RestrictRoute(
        store,
        async (ctx) => {
            try {
                const users = await Api(ctx).users.getAll()

                return {
                    props: {
                        users,
                    },
                }
            } catch (error) {
                console.log(error)
            }
            return {
                props: {
                    users: {},
                },
            }
        },
        [ROLES.moder, ROLES.admin]
    )
)

export default Users
