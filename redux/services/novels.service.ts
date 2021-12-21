import { AxiosInstance } from "axios"
import { CreateNovelDto, SearchNovelsDto } from "../types/novels"

export const NovelsDataService = (instance: AxiosInstance) => ({
    async create(dto: CreateNovelDto | FormData) {
        const { data } = await instance.post("/novels", dto, { headers: { "Content-Type": "multipart/form-data" } })
        return data
    },

    async getById(id: number) {
        const { data } = await instance.get(`/novels/${id}`)
        return data
    },

    async getPopular() {
        const { data } = await instance.get("/novels/popular")
        return data
    },
    async getSearch(dto: SearchNovelsDto) {
        const { data } = await instance.get("/novels/search", { params: dto })
        return { items: data[0], total: data[1] }
    },
})
