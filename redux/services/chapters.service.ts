import { AxiosInstance } from "axios"
import { CreateChapterDto, UpdateChapterDto } from "../types/chapters"

export const ChaptersDataService = (instance: AxiosInstance) => ({
    async create(dto: CreateChapterDto) {
        const { data } = await instance.post("/chapters", dto)
        return data
    },
    async update(id: number, dto: UpdateChapterDto) {
        const { data } = await instance.patch(`/chapters/${id}`, dto)
        return data
    },
    async delete(id: number) {
        const { data } = await instance.delete(`/chapters/${id}`)
        return data
    },

    async getById(id: number) {
        const { data } = await instance.get(`/chapters/${id}`)
        return data
    },
    async getByNovelId(id: number) {
        const { data } = await instance.get(`/chapters/novel/${id}`)
        return data
    },
})
