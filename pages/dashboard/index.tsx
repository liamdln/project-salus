import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";
import Layout from "../../components/layout";
import { capitalizeFirstLetter } from "../../lib/utils";

const Dashboard: NextPage = (props: any) => {

    const session = useSession();
    const userName = session.data?.user?.name || "";

    if (session.status === "loading") {
        return (
            <h1>Loading</h1>
        )
    }

    const Map = dynamic(
        () => import("../../components/map"),
        { ssr: false }
    )

    return (
        <Layout>
            <div className="container text-center">
                <h1>Hello { capitalizeFirstLetter(userName) }!</h1>
                <Map></Map>
            </div>
        </Layout>

    );
};

export default Dashboard;