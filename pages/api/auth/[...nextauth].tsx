import NextAuth from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { env } from "process"
import { Api } from "../../../redux/api"
import { ConnectionOptions } from "typeorm"
import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"

const connection: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "worldnovels",
}

export default NextAuth({
    // adapter: TypeORMLegacyAdapter(connection),
    providers: [
        CredentialProvider({
            name: "wn.com",
            credentials: {
                username: { label: "Email", type: "email", placeholder: "" },
                password: { label: "password", type: "password", placeholder: "" },
            },
            async authorize(credentials) {
                const response = await Api().users.login({ email: credentials?.username, password: credentials?.password })
                return response
            },
        }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // }),
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.user = user
            }
            return token
        },
        session: ({ session, token }) => {
            if (token) {
                session.user = token.user
                // session.user && session.user.name; = token.name
            }
            return session
        },
    },
    secret: "test",
    jwt: {
        secret: "test",
    },
})
