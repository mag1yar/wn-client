import React, { cloneElement } from "react"
import { useAppSelector } from "../../redux/hooks"
import { selectUserData } from "../../redux/reducers/users"
import { PERMISSIONS, ROLES } from "./permissions"
import { useSession } from "next-auth/react"

interface RestrictProps {
    scopes: any
    error?: React.ReactNode
    errorProps?: any
    children: any
}

type PermissionsTypes = {
    scopes: string[]
    permissions: string[]
}

const hasPermission = ({ permissions, scopes }: PermissionsTypes) => {
    const scopesMap: any = []
    scopes.forEach((scope) => {
        scopesMap[scope] = true
    })

    return permissions.some((permission: string) => scopesMap[permission])
}

const Restrict: React.FC<RestrictProps> = (props) => {
    const { scopes = [], error, errorProps, children } = props

    const userData = useAppSelector(selectUserData)
    // const { data: session } = useSession()
    // const userData = session?.user

    const permissions = userData ? PERMISSIONS[userData.role] : PERMISSIONS[ROLES.guest]

    const permissionGranted = hasPermission({ permissions, scopes })

    if (!permissionGranted && !errorProps) return error ? <>{error}</> : <></>
    if (!permissionGranted && errorProps) return cloneElement(children, { ...errorProps })

    return <>{children}</>
}

export default Restrict
