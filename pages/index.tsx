import styles from "../styles/Home.module.css"

import type { GetServerSideProps, NextPage } from "next"
import { wrapper } from "../redux/store"
import { MainLayout } from "../components/layouts/MainLayout"
import { Api } from "../redux/api"
import Slider from "../components/slider"
import moreImage from "../public/image/More.png"
import { NovelsDto } from "../redux/types/novels"
import getServerImage from "../utils/serverImage"

interface HomeProps {
    novels: NovelsDto[]
}

const Home: NextPage<HomeProps> = (props) => {
    const { novels } = props

    const sliderData = novels.map((val) => {
        return {
            title: val.name,
            author: val.authorId,
            chapters: val.chapters,
            href: `/novel/${val.id}`,
            src: val.picture ? getServerImage(val.picture) : moreImage.src,
            rank: 1,
        }
    })
    return (
        <MainLayout>
            <Slider data={sliderData} more="/popular" moreTitle="Популярные" moreUnder="Читать" />
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
    try {
        const { novels } = await Api().novels.getPopular()
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
            novels: [],
        },
    }
})

export default Home
