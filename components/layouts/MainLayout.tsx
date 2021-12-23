import React, { Fragment } from "react"
import Link from "next/link"
import {
    AppBar,
    Drawer,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Theme,
    Toolbar,
    Typography,
    useTheme,
    CSSObject,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    Button,
    Container,
    useMediaQuery,
} from "@mui/material"
import { Box, styled } from "@mui/system"
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Newspaper as NewspaperIcon,
    LocalFireDepartment as PopularIcon,
    MenuBook as NewIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    LibraryBooksOutlined as LibraryBooksIcon,
    AccountCircle as AccountCircleIcon,
    Search as SearchIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
} from "@mui/icons-material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCog } from "@fortawesome/free-solid-svg-icons"
import FontAwesomeMuiIcon from "../icon/FontAwesomeMuiIcon"
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons"
import { ThemeModeContext } from "../../pages/_app"
import AuthModal from "../modal/auth"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectUserData, setUserData } from "../../redux/reducers/users"
import { useRouter } from "next/router"
import SearchModal from "../modal/search"
import { destroyCookie } from "nookies"
import { useSnackbar } from "notistack"
import { UserDto } from "../../redux/types/users"
import Restrict from "../permission/Restrict"
import { SCOPES } from "../permission/permissions"

interface MainLayoutProps {
    children: any
}

const menuWidth = 220
const menu = [
    { text: "Лента", icon: <NewspaperIcon />, path: "/" },
    { text: "Новинки", icon: <NewIcon />, path: "/new" },
    { text: "Популярные", icon: <PopularIcon />, path: "/top" },
]

const openedMixin = (theme: Theme): CSSObject => ({
    width: menuWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
})
const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
})

const SideMenu = styled(Drawer, { shouldForwardProp: (prop: any) => prop !== "open" })(({ theme, open }: any) => ({
    width: menuWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
    "& .MuiListItemIcon-root": {
        marginLeft: 7,
    },
}))

const sideMenuContent = (
    <>
        <Toolbar />
        {menu.map(({ text, icon, path }) => (
            <Link href={path} passHref key={text}>
                <ListItem button>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                </ListItem>
            </Link>
        ))}
        <Divider />
    </>
)

export const MainLayout: React.FC<MainLayoutProps> = (props) => {
    const { children } = props
    const router = useRouter()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const dispatch = useAppDispatch()

    const userData = useAppSelector(selectUserData)
    // const { data: session } = useSession()
    // const userData = session?.user

    const theme = useTheme()
    const themeMode = React.useContext(ThemeModeContext)
    const isScreenSm = !useMediaQuery(theme.breakpoints.up("sm"))

    const [openAuthModal, setOpenAuthModal] = React.useState(false)
    const [openSearchModal, setOpenSearchModal] = React.useState(false)

    const [openMenu, setOpenMenu] = React.useState(false)
    const [openMobileMenu, setOpenMobileMenu] = React.useState(false)

    const [anchorProfile, setAnchorProfile] = React.useState<null | HTMLElement>(null)
    const openAnchorProfile = Boolean(anchorProfile)
    const handleClickProfile = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorProfile(event.currentTarget)
    }
    const handleCloseProfile = () => {
        setAnchorProfile(null)
    }

    React.useEffect(() => {
        if (openAuthModal && userData) {
            setOpenAuthModal(false)
        }
    }, [openAuthModal, userData])

    const handleLogout = () => {
        enqueueSnackbar(`До скорой встречи ${userData?.login}`, { variant: "info", autoHideDuration: 5000 })
        destroyCookie(null, "token", { path: "/" })
        dispatch(setUserData(null))
        // router.push("/")
    }

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => {
                                !isScreenSm && setOpenMenu(!openMenu)
                                isScreenSm && setOpenMobileMenu(!openMobileMenu)
                            }}
                            sx={{ marginRight: "15px" }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}>
                            <Link href="/" passHref>
                                <Typography variant="h5" noWrap component="a">
                                    {isScreenSm ? "WN" : "WorldNovels"}
                                </Typography>
                            </Link>
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton color="inherit" onClick={() => setOpenSearchModal(true)}>
                                <SearchIcon fontSize="medium" />
                            </IconButton>
                            <IconButton onClick={themeMode.toggleThemeMode} color="inherit">
                                {theme.palette.mode == "light" ? (
                                    <FontAwesomeMuiIcon icon={faSun} fontSize="small" />
                                ) : (
                                    <FontAwesomeMuiIcon icon={faMoon} fontSize="small" />
                                )}
                            </IconButton>
                            <IconButton color="inherit" onClick={handleClickProfile}>
                                {userData ? <Avatar>{userData.login[0].toUpperCase()}</Avatar> : <AccountCircleIcon />}
                            </IconButton>
                            <Menu
                                anchorEl={anchorProfile}
                                open={openAnchorProfile}
                                onClose={handleCloseProfile}
                                onClick={handleCloseProfile}
                                transformOrigin={{ horizontal: "right", vertical: "top" }}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                            >
                                {userData ? (
                                    <div>
                                        <MenuItem onClick={() => router.push(`/user/${userData.id}`)}>
                                            {/* <Avatar sx={{ marginRight: 2 }}>{userData.login[0].toUpperCase()}</Avatar> */}
                                            <ListItemIcon>
                                                <AccountCircleIcon />
                                            </ListItemIcon>
                                            <Typography>{userData.login}</Typography>
                                        </MenuItem>
                                        <Divider />
                                        <Restrict scopes={[SCOPES.viewAdminPanel]}>
                                            <MenuItem onClick={() => router.push(`/admin`)}>
                                                <ListItemIcon>
                                                    <AdminPanelSettingsIcon />
                                                </ListItemIcon>
                                                Админ панель
                                            </MenuItem>
                                            <Divider />
                                        </Restrict>
                                        <MenuItem onClick={() => router.push(`/my`)}>
                                            <ListItemIcon>
                                                <LibraryBooksIcon />
                                            </ListItemIcon>
                                            Мои новеллы
                                        </MenuItem>
                                        <MenuItem onClick={() => router.push(`/settings`)}>
                                            <ListItemIcon>
                                                <SettingsIcon />
                                            </ListItemIcon>
                                            Настройки
                                        </MenuItem>
                                        <MenuItem onClick={() => handleLogout()}>
                                            <ListItemIcon>
                                                <LogoutIcon />
                                            </ListItemIcon>
                                            Выйти
                                        </MenuItem>
                                    </div>
                                ) : (
                                    <Box sx={{ p: 1, width: 200 }}>
                                        <Button onClick={() => setOpenAuthModal(true)} fullWidth variant="contained" color="primary">
                                            Вход
                                        </Button>
                                        {/* <Button onClick={() => router.push("/signup")} variant="contained" sx={{ ml: 1 }}>
                                            Регистрация
                                        </Button> */}
                                    </Box>
                                )}
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box component="nav">
                    {isScreenSm ? (
                        <Drawer
                            variant="temporary"
                            ModalProps={{ keepMounted: true }}
                            open={openMobileMenu}
                            onClose={() => {
                                setOpenMobileMenu(false)
                            }}
                            sx={{
                                display: { xs: "block", sm: "none" },
                                "& .MuiDrawer-paper": { boxSizing: "border-box", width: menuWidth },
                            }}
                        >
                            {sideMenuContent}
                        </Drawer>
                    ) : (
                        <SideMenu
                            variant="permanent"
                            open={openMenu}
                            sx={{
                                display: { xs: "none", sm: "block" },
                            }}
                        >
                            {sideMenuContent}
                        </SideMenu>
                    )}
                </Box>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Container>
                        <Toolbar />
                        {children}
                    </Container>
                </Box>
            </Box>
            <AuthModal close={setOpenAuthModal} open={openAuthModal} />
            <SearchModal close={setOpenSearchModal} open={openSearchModal} />
        </>
    )
}
