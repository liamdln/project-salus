import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Salus</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container text-center">
                <h1>Welcome</h1>
                <a href="/auth/login" className="btn btn-primary">Login</a>
            </div>
        </div>
    )
}
