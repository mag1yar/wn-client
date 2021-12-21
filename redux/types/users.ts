export type LoginDto = {
    email: string | undefined
    password: string | undefined
}

export type CreateUserDto = {
    login: string
} & LoginDto

export type UserDto = {
    id: number
    login: string
    email: string
    image?: string
    token: string
    role: string
    locked: boolean
    createdAt: string
    updatedAt: string
}

export type UpdateUserDto = {
    login?: string
    email?: string
    image?: string
    role?: string
    locked?: boolean
    updatedAt?: string
}
