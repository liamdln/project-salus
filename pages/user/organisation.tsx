import { NextPage } from "next";
import Layout from "../../components/layout";
import { useSession } from "next-auth/react";

const Organisation: NextPage = () => {

    const session = useSession();

    return (
        <Layout>
            <h1>Organisation</h1>
        </Layout>

    );
};

export default Organisation;