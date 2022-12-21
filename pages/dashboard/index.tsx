import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";
import Layout from "../../components/layout";
import { readSettings } from "../../config/settings";
import { capitalizeFirstLetter } from "../../lib/utils";
import "../../styles/Login.module.css"

const Dashboard: NextPage = (props: any) => {

    const session = useSession();
    const userName = session.data?.user?.name;

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
                <Map settings={JSON.parse(props.settings)}></Map>
            </div>
        </Layout>

    );
};

export async function getServerSideProps() {
    const rawSettings = await readSettings("map");
    // parse the result of the db call into a string and remove the [] brackets around the object.
    const settings = JSON.stringify(rawSettings).slice(1, -1);
    return { props: { settings } }
}

export default Dashboard;