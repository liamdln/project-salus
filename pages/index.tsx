import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import Loading from "../components/loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {

    const session = useSession();
    const router = useRouter();
    if (session.status === "loading") {
        return (<Loading />);
    } else if (session.status === "authenticated") {
        router.push("/dashboard");
        return (<Loading />);
    } else {
        router.push("/dashboard");
        return (<Loading />);
    }
}

