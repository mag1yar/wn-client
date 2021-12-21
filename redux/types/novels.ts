import { UserDto } from "./users"

export type CreateNovelDto = {
    name: string
    description: string
    picture?: File
    genres?: string[]
    tags?: string[]
    chapters?: number
    country: string
    authorId: number
    illustrator?: string
    publishingHouse?: string
    releaseYear: string
    status: string
    ageRating: boolean
}

export type NovelsDto = {
    id: number
    authorId: number
    author: UserDto

    name: string
    description: string
    picture?: string

    genres?: string
    tags?: string

    chapters?: number
    country: string
    illustrator?: string
    publishingHouse?: string
    releaseYear?: string
    status: string
    ageRating: number

    views: number

    createdAt: Date
    updatedAt: Date
}

export type SearchNovelsDto = {
    name?: string
    genres?: string
    tags?: string
    chapters?: "DESC" | "ASC"
    country?: string
    authorId?: number
    illustrator?: string
    publishingHouse?: string
    releaseYear?: string
    status?: string
    ageRating?: boolean

    views?: "DESC" | "ASC"
    limit?: number
    take?: number
} | null
