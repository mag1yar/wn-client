import { GetServerSidePropsContext, NextPageContext } from "next"
import axios from "axios"
import Cookies, { parseCookies } from "nookies"

import UsersDataService from "./services/users.service"
import { NovelsDataService } from "./services/novels.service"
import { ChaptersDataService } from "./services/chapters.service"
import { getSession } from "next-auth/react"

export type ApiReturnType = {
    users: ReturnType<typeof UsersDataService>
    novels: ReturnType<typeof NovelsDataService>
    chapters: ReturnType<typeof ChaptersDataService>
}

export const Api = (ctx?: NextPageContext | GetServerSidePropsContext): ApiReturnType => {
    const cookies = ctx ? Cookies.get(ctx) : parseCookies()
    // const session = await getSession(ctx)
    // const token = session?.user.token
    const token = cookies.token

    const instance = axios.create({
        baseURL: "https://wn-server.herokuapp.com",
        headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + token,
        },
    })
    return {
        users: UsersDataService(instance),
        novels: NovelsDataService(instance),
        chapters: ChaptersDataService(instance),
    }
}
