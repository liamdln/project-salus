import "../styles/globals.css"
import "bootstrap/dist/css/bootstrap.css"
import "../styles/bs-custom.scss"
import "nprogress/nprogress.css"

import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { useEffect } from 'react'
import dbConnect from "../lib/dbConnect"
import NProgress from "nprogress"
import { useRouter } from "next/router"

function MyApp({ Component, pageProps }: AppProps) {

    const router = useRouter();
    NProgress.configure({ showSpinner: false });

    useEffect(() => {
        // import bootstrap javascript on the client
        typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null

        // loading bar
        const startRouteChangeLoading = () => {
            NProgress.start();
        }
        const stopRouteChangeLoading = () => {
            NProgress.done();
        }

        router.events.on('routeChangeStart', startRouteChangeLoading)
        router.events.on('routeChangeComplete', stopRouteChangeLoading)
        router.events.on('routeChangeError', stopRouteChangeLoading)

        return () => {
            router.events.off('routeChangeStart', startRouteChangeLoading)
            router.events.off('routeChangeComplete', stopRouteChangeLoading)
            router.events.off('routeChangeError', stopRouteChangeLoading)
        }

    }, [router])

    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    );

}

export async function getServerSideProps() {
    await dbConnect();
    return;
} 

export default MyApp
