import { NextComponentType } from "next"
import App from "next/app"
import { useRouter } from "next/router"
import { useAppSelector } from "../../redux/hooks"
import { selectUserData } from "../../redux/reducers/users"
import { isClient } from "../../utils/constants/env"
import { ROLES, ROUTES_PERMISSIONS } from "./permissions"
import { useSession } from "next-auth/react"

const withRestrictRoute = (Component: NextComponentType | App | any) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        if (isClient) {
            const router = useRouter()

            const userData = useAppSelector(selectUserData)
            // const { data: session } = useSession()
            // const userData = session?.user

            const permissions = userData ? ROUTES_PERMISSIONS[userData.role] : ROUTES_PERMISSIONS[ROLES.guest]

            let permissionGranted = false
            permissions.forEach((permission) => {
                if (permission === router.pathname) {
                    permissionGranted = true
                    return
                }
            })

            if (!permissionGranted) {
                // ctx.replace("/")
            }

            return <Component {...props} />
        }
        return null
    }
}
export default withRestrictRoute
