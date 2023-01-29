import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/bs-custom.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { useEffect } from 'react'
import dbConnect from '../lib/dbConnect'

function MyApp({ Component, pageProps }: AppProps) {

    useEffect(() => {
        // import bootstrap javascript on the client
        typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
    })
    
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

export default MyApp
