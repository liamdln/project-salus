import type { NextPage } from "next";
import Loading from "../../components/loading";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

const Logout: NextPage = () => {

    const session = useSession();
    const router = useRouter();

    if (session.status === "authenticated" || session.status === "loading") {
        return (
            <>
                <Head>
                    <title>Auth - ProjectSalus</title>
                </Head>
                <Loading />
            </>

        )
    } else {
        router.push("/")
        return (
            <>
                <Head>
                    <title>Auth - ProjectSalus</title>
                </Head>
                <Loading />
            </>
        )
    }

};

export default Logout;