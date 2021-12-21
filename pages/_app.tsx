import type { AppProps } from "next/app"
import Head from "next/head"
import { createTheme, CssBaseline, IconButton, ThemeProvider } from "@mui/material"
import React from "react"
import NProgress from "nprogress"
import Router from "next/router"
import "../styles/globals.css"
import "../styles/nprogress.css"
import { wrapper } from "../redux/store"
import { setUserData } from "../redux/reducers/users"
import { Api } from "../redux/api"
import { SnackbarKey, SnackbarProvider } from "notistack"
import { Close as CloseIcon } from "@mui/icons-material"
import withRestrictRoute from "../components/permission/withRestrictRoute"
import { LocalizationProvider } from "@mui/lab"
import DateAdapter from "@mui/lab/AdapterMoment"
import { isClient } from "../utils/constants/env"
import { SessionProvider, getSession } from "next-auth/react"

export const ThemeModeContext = React.createContext({
    toggleThemeMode: () => {},
})
type ThemeModeType = "light" | "dark"

const NProgressLoad = () => {
    NProgress.configure({ showSpinner: false })
    Router.events.on("routeChangeStart", () => {
        NProgress.start()
    })
    Router.events.on("routeChangeComplete", () => {
        NProgress.done()
    })
    Router.events.on("routeChangeError", () => {
        NProgress.done()
    })
}

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const [themeMode, setThemeMode] = React.useState<ThemeModeType>("light")
    React.useEffect(() => {
        if (isClient) {
            const mode = localStorage.getItem("themeMode") as ThemeModeType
            if (mode) setThemeMode(mode)
        }
    }, [])

    const toggleThemeMode = React.useMemo(
        () => ({
            toggleThemeMode: () => {
                let mode = "light"
                setThemeMode((prevMode) => {
                    mode = prevMode === "light" ? "dark" : "light"
                    return mode as ThemeModeType
                })
                if (isClient) {
                    localStorage.setItem("themeMode", mode)
                }
            },
        }),
        []
    )

    NProgressLoad()

    const notistackRef = React.createRef<SnackbarProvider>()
    const onCloseNotistack = (key: SnackbarKey) => () => {
        if (notistackRef.current) notistackRef.current.closeSnackbar(key)
    }

    const theme = createTheme({
        palette: {
            mode: themeMode,
            primary: {
                main: "#5600e2",
            },
            secondary: {
                main: "#f50057",
            },
        },
    })
    return (
        <>
            <Head>
                <title>WorldNovels</title>
            </Head>
            <ThemeModeContext.Provider value={toggleThemeMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <SnackbarProvider
                        maxSnack={3}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        autoHideDuration={2000}
                        ref={notistackRef}
                        action={(key) => (
                            <IconButton color="inherit" onClick={onCloseNotistack(key)} aria-label="delete">
                                <CloseIcon />
                            </IconButton>
                        )}
                    >
                        <LocalizationProvider dateAdapter={DateAdapter}>
                            <SessionProvider session={session}>
                                <Component {...pageProps} />
                            </SessionProvider>
                        </LocalizationProvider>
                    </SnackbarProvider>
                </ThemeProvider>
            </ThemeModeContext.Provider>
        </>
    )
}

App.getInitialProps = wrapper.getInitialPageProps((store) => async ({ ctx, Component }: any) => {
    try {
        const userData = await Api(ctx).users.getMe()
        store.dispatch(setUserData(userData))
        // RestrictRoute(ctx, userData)
    } catch (error) {
        // throw new Error("Can't get InitialProps")
    }
    return {
        pageProps: {
            ...(Component.getInitialProps ? await Component.getInitialProps({ ...ctx, store }) : {}),
        },
    }
})

export default wrapper.withRedux(App)
