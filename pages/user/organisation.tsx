import { NextPage } from "next";
import Layout from "../../components/layout";
import { useSession } from "next-auth/react";
import Loading from "../../components/loading";
import { useRouter } from "next/router";

const Organisation: NextPage = () => {

    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    }

    return (
        <Layout>
            <h1>Organisation</h1>
        </Layout>

    );
};

export default Organisation;