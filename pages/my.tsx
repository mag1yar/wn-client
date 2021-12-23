import { Box, Button, Divider, Grid, Paper } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import NovelCard from "../components/card/novel/NovelCard"
import { MainLayout } from "../components/layouts/MainLayout"
import { Api } from "../redux/api"
import { wrapper } from "../redux/store"
import { SearchNovelsDto } from "../redux/types/novels"
import moreImage from "../public/image/More.png"
import AddButton from "../components/dataEntry/button/AddButton"
import { useRouter } from "next/router"
import { Add as AddIcon } from "@mui/icons-material"
import getServerImage from "../utils/serverImage"
import { RestrictRoute } from "../components/permission/RestrictRoute"
import { ROLES } from "../components/permission/permissions"
// import Image from "next"

// const novels = [{ title: "Поднятие уровня в одиночку", src: "https://staticlib.me/uploads/cover/solo-leveling/cover/ENpNDMytyJ8B_250x350.jpg", href: "/1" }]

interface MyProps {
    novels: any[]
}

const My: NextPage<MyProps> = (props) => {
    const { novels } = props
    const router = useRouter()
    return (
        <MainLayout>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2, mb: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={() => router.push("/add")}>
                    Создать
                </Button>
            </Box>
            {/* <Divider sx={{ mt: 2, mb: 2 }} /> */}
            <Grid container spacing={2}>
                {novels &&
                    novels.map(({ id, name: title, authorId, picture }) => (
                        <Grid item xl={3} lg={3} md={3} sm={6} xs={6} key={id}>
                            <NovelCard src={picture ? getServerImage(picture) : moreImage.src} href={`/novel/${id}`} title={title} />
                        </Grid>
                    ))}
                {/* <Grid item xl={3} lg={3} md={3} sm={6} xs={6}>
                    <NovelCard src={moreImage.src} href={"/create"} title="Добавить" />
                    <AddButton href="/add" />
                </Grid> */}
            </Grid>
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) =>
    RestrictRoute(
        store,
        async (ctx) => {
            try {
                const state = store.getState()
                const dto: SearchNovelsDto = {
                    authorId: state.user.data?.id,
                }
                const { items: novels } = await Api(ctx).novels.getSearch(dto)
                return {
                    props: {
                        novels,
                    },
                }
            } catch (error) {
                console.log(error)
            }
            return {
                props: {
                    novels: null,
                },
            }
        },
        [ROLES.reader, ROLES.author, ROLES.moder, ROLES.admin]
    )
)

export default My
