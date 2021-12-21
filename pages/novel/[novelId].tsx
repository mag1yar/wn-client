import Link from "next/link"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    ButtonGroup,
    Chip,
    Collapse,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Rating,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { MainLayout } from "../../components/layouts/MainLayout"
// import Image from "next"
import moreImage from "../../public/image/More.png"
import React from "react"
import { TabContext, TabPanel } from "@mui/lab"
import {
    Add as AddIcon,
    Done as DoneIcon,
    Edit as EditIcon,
    Feed as FeedIcon,
    LibraryBooks as LibraryBooksIcon,
    QuestionAnswer as QuestionAnswerIcon,
    Reviews as ReviewsIcon,
    Comment as CommentIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material"
import { wrapper } from "../../redux/store"
import { Api } from "../../redux/api"
import styles from "../../styles/Novel.module.scss"
import { NovelsDto } from "../../redux/types/novels"
import { DataGrid, GridColDef, GridToolbarContainer } from "@mui/x-data-grid"
import { faBookReader, faEdit, faPen } from "@fortawesome/free-solid-svg-icons"
import FontAwesomeMuiIcon from "../../components/icon/FontAwesomeMuiIcon"
import { ChapterDto } from "../../redux/types/chapters"
import { useAppSelector } from "../../redux/hooks"
import { selectUserData } from "../../redux/reducers/users"
import Comment from "../../components/comment"
import moment from "moment"
import ChapterEditModal from "../../components/modal/chapterEdit"
import getServerImage from "../../utils/serverImage"

interface NovelProps {
    novel: NovelsDto
    chapters: ChapterDto[]
}

const Novel: NextPage<NovelProps> = (props) => {
    const { novel, chapters } = props

    const userData = useAppSelector(selectUserData)
    // const { data: session } = useSession()
    // const userData = session?.user

    const canEdit = novel.authorId === userData?.id
    const router = useRouter()
    const { novelId } = router.query
    const [tabValue, setTabValue] = React.useState("information")
    const [showDescription, setShowDescription] = React.useState(false)

    const [openChapterEditModal, setOpenChapterEditModal] = React.useState(false)
    const [selectedChapter, setSelectedChapter] = React.useState<ChapterDto | null>(null)

    const handleTabChange = (e: React.SyntheticEvent<Element, Event>, value: string) => {
        setTabValue(value)
    }

    const handleSelectChapter = (chapter: ChapterDto) => {
        if (chapter) {
            setSelectedChapter(chapter)
            setOpenChapterEditModal(true)
        }
    }

    const tableColumns: GridColDef[] = [
        // { field: "id", headerName: "", hideSortIcons: true, width: 10, disableColumnMenu: true },
        {
            field: "edit",
            headerName: "Изменить",
            renderCell: (params) => (
                <>
                    <IconButton size="small" onClick={() => router.push(`/novel/${novelId}/${params.value}?edit`)}>
                        <FontAwesomeMuiIcon fontSize="inherit" icon={faPen} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleSelectChapter(params.row)}>
                        <FontAwesomeMuiIcon fontSize="inherit" icon={faEdit} />
                    </IconButton>
                </>
            ),
            hideSortIcons: true,
            width: 70,
            disableColumnMenu: true,
            sortable: false,
            align: "center",
            hide: !canEdit,
        },
        {
            field: "read",
            headerName: "Читать",
            renderCell: (params) => {
                if (!canEdit && params.row.status === "edit") return <></>
                return (
                    <IconButton color="inherit" size="small" onClick={() => router.push(`/novel/${novelId}/${params.value}`)}>
                        <FontAwesomeMuiIcon fontSize="inherit" icon={faBookReader} />
                    </IconButton>
                )
            },
            hideSortIcons: true,
            width: 10,
            disableColumnMenu: true,
            sortable: false,
        },
        { field: "name", headerName: "Название", minWidth: 100, width: 200, disableColumnMenu: true },
        {
            field: "status",
            headerName: "Статус",
            hideSortIcons: true,
            width: 80,
            disableColumnMenu: true,
            renderCell: (p) => {
                switch (p.value) {
                    case "edit":
                        return (
                            <Tooltip title="Редактируется">
                                <EditIcon color="info" />
                            </Tooltip>
                        )
                    case "ready":
                        return (
                            <Tooltip title="Готово">
                                <DoneIcon color="success" />
                            </Tooltip>
                        )
                    default:
                        return <></>
                }
            },
            align: "center",
        },
        {
            field: "rating",
            headerName: "Рейтинг",
            renderCell: (params) => <Rating value={params.value} precision={0.1} readOnly />,
            hideSortIcons: true,
            width: 140,
            disableColumnMenu: true,
            hide: true,
        },

        { field: "updatedAt", headerName: "Последнее изменение", hideSortIcons: true, minWidth: 150, disableColumnMenu: true },
    ]
    let tableRows = []
    for (let i = 0; i < chapters.length; i++) {
        const c = chapters[i]
        tableRows.push({ ...c, edit: c.id, read: c.id, updatedAt: moment(c.updatedAt).fromNow() })
    }

    const tableToolbar = () => {
        return (
            <>
                <GridToolbarContainer>
                    {canEdit && (
                        <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={() => router.push(`/novel/${novelId}/0`)}>
                            Добавить главу
                        </Button>
                    )}
                </GridToolbarContainer>
                <Divider sx={{ mt: 1 }} />
            </>
        )
    }

    const [descriptionHeight, setDescriptionHeight] = React.useState(0)
    const descriptionRef = React.useRef(null)

    React.useEffect(() => {
        setDescriptionHeight(descriptionRef?.current?.clientHeight || 0)
    }, [])

    return (
        <MainLayout>
            <Grid container lg={12} md={12} sm={12} xs={12} className={styles.novel}>
                <Grid item container lg={3} md={3} sm={4} xs={12}>
                    <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                        <Paper elevation={8} className={styles.novel__image}>
                            <img src={novel.picture ? getServerImage(novel.picture) : moreImage.src} />
                        </Paper>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                        <Link href={`/novel/${novelId}/1`} passHref>
                            <Button variant="contained" color="primary" size="large" fullWidth>
                                Читать
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                        <Paper elevation={8}>
                            <List>
                                <ListItem>
                                    <ListItemText primary={novel.country} secondary="Страна" />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText primary={novel.author.login} secondary="Автор" />
                                </ListItem>
                                <Divider />
                                {novel.illustrator && (
                                    <>
                                        <ListItem>
                                            <ListItemText primary={novel.illustrator} secondary="Илюстратор" />
                                        </ListItem>
                                        <Divider />
                                    </>
                                )}
                                {novel.publishingHouse && (
                                    <>
                                        <ListItem>
                                            <ListItemText primary={novel.publishingHouse} secondary="Издательство" />
                                        </ListItem>
                                        <Divider />
                                    </>
                                )}
                                <ListItem>
                                    <ListItemText primary={novel.releaseYear} secondary="Год релиза" />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText primary={novel.status} secondary="Статус" />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText primary={novel.ageRating ? "+18" : "Нету"} secondary="Возрастной рейтинг" />
                                </ListItem>

                                {novel.chapters && (
                                    <>
                                        <Divider />
                                        <ListItem>
                                            <ListItemText primary={novel.chapters} secondary="Количество глав" />
                                        </ListItem>
                                    </>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item lg={9} md={9} sm={8} xs={12}>
                    <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                        <Typography variant="h5">{novel.name}</Typography>
                        {/* <Typography variant="subtitle1">Solo Leveling / 나 혼자만 레벨업</Typography> */}
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} padding={1}>
                        <Paper elevation={6}>
                            <TabContext value={tabValue}>
                                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                    <Tabs onChange={handleTabChange} value={tabValue} textColor="inherit" variant="scrollable" scrollButtons="auto">
                                        <Tab
                                            value="information"
                                            label={
                                                <Tooltip title="Информация">
                                                    <FeedIcon />
                                                </Tooltip>
                                            }
                                        />
                                        <Tab
                                            value="chapters"
                                            label={
                                                <Tooltip title="Главы">
                                                    <LibraryBooksIcon />
                                                </Tooltip>
                                            }
                                        />
                                        <Tab
                                            value="comments"
                                            label={
                                                <Tooltip title="Комментарии">
                                                    <CommentIcon />
                                                </Tooltip>
                                            }
                                        />
                                        <Tab
                                            value="reviews"
                                            label={
                                                <Tooltip title="Рецензии">
                                                    <ReviewsIcon />
                                                </Tooltip>
                                            }
                                        />
                                        <Tab
                                            value="discussion"
                                            label={
                                                <Tooltip title="Обсуждении">
                                                    <QuestionAnswerIcon />
                                                </Tooltip>
                                            }
                                        />
                                    </Tabs>
                                </Box>
                                <TabPanel value="information">
                                    <Collapse in={showDescription} collapsedSize={descriptionHeight < 60 ? descriptionHeight + 5 : 60}>
                                        <Typography ref={descriptionRef} align="justify" variant="body2" whiteSpace="pre-line">
                                            {novel.description}
                                        </Typography>
                                    </Collapse>
                                    {descriptionHeight > 60 && (
                                        <Button
                                            // variant="outlined"
                                            color="inherit"
                                            size="small"
                                            onClick={() => setShowDescription(!showDescription)}
                                            startIcon={showDescription ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        >
                                            {showDescription ? "Скрыть" : "Больше..."}
                                        </Button>
                                    )}
                                    <Divider />
                                    <Typography variant="subtitle1">Жанры</Typography>
                                    <Box sx={{ p: 1 }}>
                                        {novel.genres && novel.genres.map((genre: string) => <Chip key={genre} label={genre} className={styles.novel__chip} />)}
                                    </Box>
                                    <Divider />
                                    <Typography variant="subtitle1">Тэги</Typography>
                                    <Box sx={{ p: 1 }}>
                                        {novel.tags && novel.tags.map((tag: string) => <Chip key={tag} label={tag} className={styles.novel__chip} />)}
                                    </Box>
                                </TabPanel>
                                <TabPanel value="chapters">
                                    {" "}
                                    {/* <div style={{ height: 400, width: "100%" }}> */}
                                    <DataGrid
                                        rows={tableRows}
                                        columns={tableColumns}
                                        autoHeight
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                        hideFooterSelectedRowCount
                                        density="compact"
                                        components={{
                                            Toolbar: tableToolbar,
                                        }}
                                    />
                                    {/* </div> */}
                                </TabPanel>
                                <TabPanel value="comments">
                                    <Comment />
                                </TabPanel>
                                <TabPanel value="reviews">В разработке</TabPanel>
                                <TabPanel value="discussion">В разработке</TabPanel>
                            </TabContext>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <ChapterEditModal chapter={selectedChapter} open={openChapterEditModal} onClose={() => setOpenChapterEditModal(false)} />
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
    try {
        const novelId = ctx.params?.novelId

        const novel = await Api(ctx).novels.getById(novelId ? +novelId : 0)
        const chapters = await Api(ctx).chapters.getByNovelId(novelId ? +novelId : 0)

        return {
            props: {
                novel,
                chapters,
            },
        }
    } catch (error) {
        console.log(error)
    }
    return {
        props: {
            novel: null,
            chapters: null,
        },
    }
})

export default Novel
