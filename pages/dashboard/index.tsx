import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import LoadingMap from "../../components/loading-map";
import { getReportsAsync } from "../../lib/reports";
import { Report } from "../../types/reports";
import Layout from "../../components/layout";
import { capitalizeFirstLetter } from "../../lib/utils";
import Loading from "../../components/loading";
import { HeatLatLngTuple, LatLng } from "leaflet";


const Map = dynamic(
    () => import("../../components/map"),
    { ssr: false, loading: () => <LoadingMap /> }
)

const Dashboard: NextPage = ({ reports }: any) => {

    const [heatmapPointsAdded, setHeatmapPointsAdded] = useState(false)

    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    }

    const userName = session.data?.user?.name || "";

    // const heatmapPoints: { point: HeatLatLngTuple[], pointAdded: boolean }[] = [];
    const heatmapPoints: (LatLng | HeatLatLngTuple)[] = [];
    JSON.parse(reports).forEach((report: Report) => {
        const intensity = ((report.severity + 1) / 2);
        // lat, lng, intensity
        heatmapPoints.push([report.lat, report.lng, intensity])
    })

    return (
        <Layout>
            <div className="container text-center">
                <h1>Hello { capitalizeFirstLetter(userName) }!</h1>
                <Map showHeatmap={true} heatmapPoints={heatmapPoints} headMapPointsAdded={ heatmapPointsAdded } setHeatmapPointsAdded={ setHeatmapPointsAdded } />
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