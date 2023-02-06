import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/bs-custom.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from 'react'
import { Router } from "next/router"
import Loading from "../components/loading"

function MyApp({ Component, pageProps }: AppProps) {

    useEffect(() => {
        // import bootstrap javascript on the client
        typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
    })

    const [pageLoading, setPageLoading] = useState(false);
    Router.events.on('routeChangeStart', () => {
        setPageLoading(true);
    });
    Router.events.on('routeChangeComplete', () => {
        setPageLoading(false);
    });

    if (pageLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
            </SessionProvider>
        );
    }
}

export default MyApp
