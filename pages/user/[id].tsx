import { Divider, Grid, Paper, Input } from "@mui/material"
import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React from "react"
import { MainLayout } from "../../components/layouts/MainLayout"
import styles from "../../styles/Chapter.module.scss"
// import Image from "next"

const Chapter: NextPage = () => {
    const router = useRouter()
    const { id } = router.query

    return <MainLayout>User id {id}</MainLayout>
}

export default Chapter
