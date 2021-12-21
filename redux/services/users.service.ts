import { AxiosInstance } from "axios"
import { CreateUserDto, LoginDto, UpdateUserDto, UserDto } from "../types/users"

const UsersDataService = (instance: AxiosInstance) => ({
    async getMe() {
        const { data } = await instance.get<UserDto>("/users/me")
        return data
    },
    async getAll() {
        const { data } = await instance.get<UserDto>("/users")
        return data
    },

    async update(id: number, dto: UpdateUserDto) {
        const { data } = await instance.patch(`/users/${id}`, dto)
        return data
    },
    async delete(id: number) {
        const { data } = await instance.delete(`/users/${id}`)
        return data
    },

    async signUp(dto: CreateUserDto | FormData) {
        const { data } = await instance.post<CreateUserDto, { data: UserDto }>("/auth/signup", dto)
        return data
    },

    async login(dto: LoginDto) {
        const { data } = await instance.post<LoginDto, { data: UserDto }>("/auth/login", dto)
        return data
    },
})

export default UsersDataService
