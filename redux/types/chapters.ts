import { OutputData } from "@editorjs/editorjs"
import { NovelsDto } from "./novels"
import { UserDto } from "./users"

export type ChapterDto = {
    id: number
    authorId: number
    novelId: number
    author: UserDto
    novel: NovelsDto

    name: string
    body: OutputData["blocks"]
    status: string

    createdAt: Date
    updatedAt: Date
}
export type CreateChapterDto = {
    authorId: number
    novelId: number
    name: string
    body: OutputData["blocks"]
    status?: string
}
export type UpdateChapterDto = {
    name?: string
    body?: OutputData["blocks"]
    status?: string
    updatedAt?: Date
}
