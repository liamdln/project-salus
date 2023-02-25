import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import LoadingMap from "../../components/loading-map";
import { getReportsAsync } from "../../lib/reports";
import { Report } from "../../types/reports";
import Layout from "../../components/layout";
import Loading from "../../components/loading";
import { HeatLatLngTuple, LatLng } from "leaflet";
import Head from "next/head";
import moment from "moment";
import { MapMarker } from "../../types/map";
import Link from "next/link";


const Map = dynamic(
    () => import("../../components/map"),
    { ssr: false, loading: () => <LoadingMap /> }
)

const Dashboard: NextPage = ({ reports }: any) => {

    const [heatmapPointsAdded, setHeatmapPointsAdded] = useState(false);
    // const [showHeatmap, setShowHeatmap] = useState(true);
    const [showMarkers, setShowMarkers] = useState(false);

    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    }

    const userName = session.data?.user?.name || "";

    // const heatmapPoints: { point: HeatLatLngTuple[], pointAdded: boolean }[] = [];
    const heatmapPoints: (LatLng | HeatLatLngTuple)[] = [];
    const markers: MapMarker[] = [];
    JSON.parse(reports).forEach((report: Report) => {
        const intensity = ((report.severity + 1) / 2);
        // lat, lng, intensity
        heatmapPoints.push([report.lat, report.lng, intensity])
        markers.push({ lat: report.lat, lng: report.lng, popupMessage: <><Link href={`/dashboard/reports/${report._id}`}>View Report</Link></> })
    })

    function getDayStage() {
        const currentHour = +moment().format("HH");
        if (currentHour >= 0 && currentHour < 12) {
            return "morning";
        } else if (currentHour >= 12 && currentHour < 17) {
            return "afternoon"
        } else if (currentHour >= 17) {
            return "evening";
        } else {
            return "day";
        }
    }

    return (
        <>
            <Head>
                <title>Dashboard - ProjectSalus</title>
            </Head>
            <Layout>
                <div className="container text-center">
                    <h1>Dashboard</h1>
                    <div className="card">
                        <div className="card-header bg-primary text-white text-start" style={{ fontSize: "1.5rem" }}>
                            Good {getDayStage()}, {userName}!
                        </div>
                        <div className="card-body">
                            <div className="text-start p-3 mb-3" style={{ border: "solid 1px #EBEEF2", borderRadius: "0.375rem" }}>
                                <span style={{ fontSize: "1.2rem", width: "100%" }}>Map Controls</span>
                                <div className="d-flex mt-1" style={{ gap: "1rem" }}>
                                    <div className="form-check">
                                        <input checked={showMarkers} type="checkbox" className="form-check-input" id="show-markers" onChange={() => (setShowMarkers(!showMarkers))} />
                                        <label className="form-check-label" htmlFor="show-markers">Enable Markers</label>
                                    </div>
                                    {/* <div className="form-check">
                                        <input checked={showHeatmap} type="checkbox" className="form-check-input" id="show-heatmap" onChange={() => (setShowHeatmap(!showHeatmap))} />
                                        <label className="form-check-label" htmlFor="show-heatmap">Enable Heatmap</label>
                                    </div> */}
                                </div>
                            </div>
                            <Map showHeatmap={true} markers={ showMarkers ? markers : [] } heatmapPoints={heatmapPoints} headMapPointsAdded={heatmapPointsAdded} setHeatmapPointsAdded={setHeatmapPointsAdded} />
                        </div>
                    </div>
                </div>
            </Layout>
        </>

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