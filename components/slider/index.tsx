import React from "react"

import SlickSlider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import styles from "./Slider.module.scss"
import moreImage from "../../public/image/More.png"
import NovelCard, { NovelCardProps } from "../card/novel/NovelCard"

interface SliderProps {
    data: {
        href: string
        src: string
        title: string
        author: string
        rank: number
        chapters: number
    }[]
    more: string
    moreTitle: string
    moreUnder: string
}

const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    draggable: false,
    swipe: false,
    pauseOnHover: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
        {
            breakpoint: 1399,
            settings: {
                slidesToShow: 7,
            },
        },
        {
            breakpoint: 1199,
            settings: {
                slidesToShow: 6,
            },
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 5,
            },
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 4,
            },
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            },
        },
        {
            breakpoint: 399,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
    ],
}

const Slider: React.FC<SliderProps> = (props) => {
    const { data, more, moreTitle, moreUnder } = props

    return (
        <div className={styles.slider}>
            <SlickSlider {...settings} className={styles.slider__slick}>
                {data.map((val: NovelCardProps) => {
                    return (
                        <NovelCard
                            key={val.title}
                            title={val.title}
                            author={val.author}
                            rank={val.rank}
                            chapters={val.chapters}
                            href={val.href}
                            src={val.src}
                            square
                        />
                    )
                })}
                {/* 
                <NovelCard src={moreImage.src} title={moreTitle} author={moreUnder} href={more} rank={0} chapters={0} square /> */}
            </SlickSlider>
        </div>
    )
}

export default Slider
