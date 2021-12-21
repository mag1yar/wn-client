import { OutputData } from "@editorjs/editorjs"
import { LoadingButton } from "@mui/lab"
import { Divider, Grid, Paper, Input, Button } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import React from "react"
import { MainLayout } from "../../../components/layouts/MainLayout"
import { Api } from "../../../redux/api"
import { useAppSelector } from "../../../redux/hooks"
import { selectUserData } from "../../../redux/reducers/users"
import { wrapper } from "../../../redux/store"
import { ChapterDto } from "../../../redux/types/chapters"
import { NovelsDto } from "../../../redux/types/novels"
import styles from "../../../styles/Chapter.module.scss"
// import Image from "next"
import { useSession } from "next-auth/react"

const Editor = dynamic(() => import("../../../components/editor"), { ssr: false })

interface ChapterProps {
    novel: NovelsDto
    chapter?: ChapterDto
}

const Chapter: NextPage<ChapterProps> = (props) => {
    const { novel, chapter } = props
    const router = useRouter()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const userData = useAppSelector(selectUserData)
    // const { data: session } = useSession()
    // const userData = session?.user

    const { novelId, chapterId } = router.query
    const [isLoading, setLoading] = React.useState(false)

    const [name, setName] = React.useState(chapter?.name || "")
    const [blocks, setBlocks] = React.useState<OutputData["blocks"]>(chapter?.body || [])

    const isCreate = !chapter && novel.authorId === userData?.id
    const isAuthor = chapter?.authorId === userData?.id
    const isEdit = router.query.edit === "" || !!router.query.edit || (!chapter && isAuthor)
    const readOnly = isEdit ? false : !!chapter
    const createChapter = async () => {
        try {
            setLoading(true)

            const dto = {
                authorId: userData?.id || 0,
                novelId: Number(novelId) || 0,
                name,
                body: blocks,
            }

            if (isCreate) {
                const data = await Api().chapters.create(dto)
                enqueueSnackbar(`${data.name} создана`, { variant: "success" })
            } else if (isEdit) {
                const data = await Api().chapters.update(Number(chapterId) || 0, dto)
                enqueueSnackbar(`Глава изменена`, { variant: "success" })
            }
            router.push(`/novel/${novelId}`)
        } catch (error) {
            console.warn("create new chapter", error)
            enqueueSnackbar("Мы не смогли создать главу", { variant: "error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <Input id="chapter" className={styles.input} readOnly={readOnly} value={name} onChange={(e) => setName(e.target.value)} placeholder="Глава..." />
            {/* <Divider /> */}
            <div className={styles.editor}>
                <Editor header delimiter readOnly={readOnly} initialBlocks={chapter?.body} onChange={(arr) => setBlocks(arr)} />
            </div>
            {(isCreate || isEdit) && (
                <LoadingButton variant="contained" disabled={!blocks.length || !name} loading={isLoading} loadingPosition="center" onClick={createChapter}>
                    {(isCreate && "Создать") || (isEdit && "Сохранить")}
                </LoadingButton>
            )}
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
    try {
        const chapterId = ctx.params?.chapterId
        const novelId = ctx.params?.novelId

        const novel = await Api(ctx).novels.getById(novelId ? +novelId : 0)
        const chapter = await Api(ctx).chapters.getById(chapterId ? +chapterId : 0)

        return {
            props: {
                novel,
                chapter,
            },
        }
    } catch (error) {
        console.log(error)
    }
    return {
        props: {
            novel: null,
            chapter: null,
        },
    }
})

export default Chapter
