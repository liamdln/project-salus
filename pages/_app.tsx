import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/bs-custom.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { useEffect } from 'react'
import dbConnect from "../lib/dbConnect"

function MyApp({ Component, pageProps }: AppProps) {

    useEffect(() => {
        // import bootstrap javascript on the client
        typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
    })

    // const [pageLoading, setPageLoading] = useState(false);
    // Router.events.on('routeChangeStart', () => {
    //     setPageLoading(true);
    // });
    // Router.events.on('routeChangeComplete', () => {
    //     setPageLoading(false);
    // });


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
