import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { AdminLayout } from "../../components/layouts/AdminLayout"
import { ROLES } from "../../components/permission/permissions"
import { RestrictRoute } from "../../components/permission/RestrictRoute"
import { useAppSelector } from "../../redux/hooks"
import { selectUserData } from "../../redux/reducers/users"
import { wrapper } from "../../redux/store"

interface AdminHomeProps {}

const AdminHome: NextPage<AdminHomeProps> = (props) => {
    const {} = props
    const router = useRouter()
    const userData = useAppSelector(selectUserData)
    // if (!userData || userData && userData.role !== 'admin') router.push("/")
    return <AdminLayout>Hello {userData?.login}</AdminLayout>
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) =>
    RestrictRoute(
        store,
        async (ctx) => {
            return { props: {} }
        },
        [ROLES.moder, ROLES.admin]
    )
)

export default AdminHome
