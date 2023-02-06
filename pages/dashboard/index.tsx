import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";
import Layout from "../../components/layout";
import LoadingMap from "../../components/loading-map";
import { capitalizeFirstLetter } from "../../lib/utils";
import { getReportsAsync } from "../../lib/reports";
import { Report } from "../../types/reports";
import { HeatmapNode } from "../../types/map";


const Map = dynamic(
    () => import("../../components/map"),
    { ssr: false, loading: () => <LoadingMap /> }
)

const Dashboard: NextPage = ({ reports }: any) => {

    const session = useSession();
    const userName = session.data?.user?.name || "";

    const heatmapPoints: HeatmapNode[] = [];
    JSON.parse(reports).forEach((report: Report) => {
        heatmapPoints.push({ lat: report.lat, lng: report.lng, intensity: 1 })
    })

    return (
        <Layout>
            <div className="container text-center">
                <h1>Hello { capitalizeFirstLetter(userName) }!</h1>
                <Map showHeatmap={true} heatmapPoints={heatmapPoints} />
            </div>
        </Layout>

    );
};

export default Dashboard;

export async function getServerSideProps() {
    // get reports
    const rawReports = await getReportsAsync();
    // parse the result of the db call into a string.
    const reports = JSON.stringify(rawReports);
    return { props: { reports } }
}