import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { UserDto } from "../../redux/types/users"

const hasPermission = (user: UserDto, roles: string[]) => {
    for (let i = 0; i < roles.length; i++) {
        if (roles[i] === user.role) return true
    }

    return false
}

export function RestrictRoute(store: any, gssp: GetServerSideProps, roles?: string[]) {
    return async (ctx: GetServerSidePropsContext) => {
        const { user } = store.getState()
        const userData = user.data

        if (!userData) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
                props: {},
            }
        }

        if (roles) {
            const permission = hasPermission(userData, roles)
            if (!permission) {
                return {
                    redirect: {
                        destination: "/",
                        permanent: false,
                    },
                }
            }
        }
        return await gssp(ctx)
    }
}
