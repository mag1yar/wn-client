import NextAuth from "next-auth"
import { UserDto } from "../redux/types/users"

declare module "next-auth" {
    interface Session {
        user: UserDto
    }
}
