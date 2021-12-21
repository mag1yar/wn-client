import { Grid, Paper, Typography } from "@mui/material"
import styles from "./NovelCard.module.scss"
import Link from "next/link"
import FontAwesomeMuiIcon from "../../icon/FontAwesomeMuiIcon"
import { faAward, faBook, faTrophy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export interface NovelCardProps {
    title: string
    author?: string
    rank?: number
    chapters?: number
    src: string
    href: string
    square?: boolean
}

const NovelCard: React.FC<NovelCardProps> = (props) => {
    const { title, author, rank, chapters, src, href, square } = props
    return (
        <>
            <Link href={href} passHref>
                <Paper elevation={6} className={styles.card} square={square}>
                    <img src={src} className={styles.card__img} />
                    <h5 className={styles.card__title}>{title}</h5>
                    {/* {author && <p className={styles.card__author}>{author}</p>} */}
                    {/* {rank && chapters && (
                        <div className={styles.card__overview}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <h4>
                                        <FontAwesomeIcon icon={faTrophy} /> {rank}
                                    </h4>
                                </Grid>
                                <Grid item xs={6}>
                                    <h4>
                                        {chapters} <FontAwesomeIcon icon={faBook} />
                                    </h4>
                                </Grid>
                            </Grid>
                        </div>
                    )} */}
                </Paper>
            </Link>
            {/* <Paper elevation={5} className={styles.card}>
                <Link href={href} passHref>
                    <a className={styles.card__link}></a>
                </Link>
                {src && <img alt={label} src={src} className={styles.card__image} />}
                {!disablePopular && (
                    <div className={styles.card__popular}>
                        <Typography>1</Typography>
                        <FontAwesomeMuiIcon icon={faAward} />
                    </div>
                )}
                <div className={styles.card__text_wrapper}>
                    <Typography className={styles.card__text_wrapper__title}>{label}</Typography>
                </div>
            </Paper> */}
        </>
    )
}

export default NovelCard
