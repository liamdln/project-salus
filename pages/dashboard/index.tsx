import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";
import Layout from "../../components/layout";
import Loading from "../../components/loading";
import LoadingMap from "../../components/loading-map";
import { capitalizeFirstLetter } from "../../lib/utils";


const Map = dynamic(
    () => import("../../components/map"),
    { ssr: false, loading: () => <LoadingMap /> }
)

const Dashboard: NextPage = () => {

    const session = useSession();
    const userName = session.data?.user?.name || "";

    if (session.status === "loading") {
        return (
            <Loading />
        )
    }

    return (
        <Layout>
            <div className="container text-center">
                <h1>Hello { capitalizeFirstLetter(userName) }!</h1>
                <Map />
            </div>
        </Layout>

    );
};

export default Dashboard;