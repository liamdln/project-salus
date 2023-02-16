import { NextPage } from "next";
import Layout from "../../components/layout";
import { useSession } from "next-auth/react";
import Loading from "../../components/loading";
import { useRouter } from "next/router";
import Head from "next/head";

const Organisation: NextPage = () => {

    const router = useRouter();
    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    } else if (session.status === "unauthenticated") {
        router.push("/auth/login");
    }

    return (
        <>
            <Head>
                <title>Organisation - ProjectSalus</title>
            </Head>
            <Layout>
                <h1>Organisation</h1>
            </Layout>
        </>
        

    );
};

export default Organisation;