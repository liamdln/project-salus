import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { RefAttributes, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../../../components/layout";
import { MapArea, MapMarker } from "../../../types/map";
import { readSettings } from "../../../config/settings";
import { Report } from "../../../types/reports";
import { useSession } from "next-auth/react";

const Map = dynamic(
    () => import("../../../components/map"),
    { ssr: false }
)

const CreateReport: NextPage = (props: Record<string, MapMarker>) => {

    const [reportMarker, setReportMarker] = useState({ lat: props.marker.lat, lng: props.marker.lng, draggable: true } as MapMarker)
    const [userLocArea, setUserLocArea] = useState({} as MapArea)
    const [getUserLocBtnBusy, setUserLocBtnBusy] = useState(false);
    const [getUserLocBtnEnabled, setGetUserLocBtnEnabled] = useState(false);
    const session = useSession();

    useEffect(() => {
        setGetUserLocBtnEnabled("geolocation" in navigator)
    })

    function getUserLocation() {
        // set the button to loading
        setUserLocBtnBusy(true)
        // get the location
        navigator.geolocation.getCurrentPosition(({ coords }: Record<string, any>) => {
            const centerLat = coords.latitude;
            const centerLng = coords.longitude;
            const radius = coords.accuracy;
            setUserLocArea({
                centerLat,
                centerLng,
                message: `Your approximate location (accurate to within ${Math.ceil(coords.accuracy)} meters).`,
                fillColour: "purple",
                borderColour: "purple",
                radius,
                stroke: true
            })
            setUserLocBtnBusy(false)
        }, error => {
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "You need to allow access to your location to use this feature.",
                // footer: `Browser returned: ${error.message}`
            })
        })

    }

    // form data
    async function submitReport(event: any) {
        event.preventDefault();
        const report: Report = {
            severity: +event.target["severity-select"].value,
            type: event.target["type-select"].value,
            description: event.target.description.value,
            author: session.data?.user?.name || "Unknown",
            status: 0,
            lat: reportMarker.lat,
            lng: reportMarker.lng
        }
        fetch("/api/reports", {
            method: "POST",
            body: JSON.stringify(report)
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <Layout>
            <div className="container text-center">
                <h1>Create a Report</h1>
                <div className="text-start" style={{ width: "75%", margin: "auto" }}>
                    <div className="card mt-3 mb-3 bg-dark">
                        <div className="card-body">
                            <form onSubmit={(e) => submitReport(e)}>
                                <div className="mb-3">
                                    <label htmlFor="severity-select" className="form-label">Severity</label>
                                    <select className="form-select" id="severity-select" aria-label="Severity level">
                                        <option value="0">None Threatening</option>
                                        <option value="1">Danger to Operations</option>
                                        <option value="2">Danger to Life</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="type-select" className="form-label">Type</label>
                                    <select className="form-select" id="type-select" aria-label="Type">
                                        <option value="fod">Foreign Object Debris (FOD)</option>
                                        <option value="wildlife">Wildlife</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea className="form-control" id="description" rows={3} defaultValue={""} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location</label>
                                    {getUserLocBtnBusy ?
                                        <button type="button" className={getUserLocBtnEnabled ? "btn btn-primary mb-3 disabled" : "d-none"} style={{ display: "block" }}>Please wait...</button> :
                                        <button type="button" onClick={() => getUserLocation()} className={getUserLocBtnEnabled ? "btn btn-primary mb-3" : "d-none"} style={{ display: "block" }}>Get current location</button>
                                    }
                                    {userLocArea.centerLat && userLocArea.centerLng ? <Map reportMarker={reportMarker} userArea={userLocArea} updateMarkerPosFunction={setReportMarker} /> : <Map reportMarker={reportMarker} updateMarkerPosFunction={setReportMarker} /> }
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export async function getServerSideProps() {
    const mapSettings = await readSettings("map");
    const marker: MapMarker = { lat: mapSettings.map.xAxisCenter, lng: mapSettings.map.yAxisCenter }
    return { props: { marker } }
}

export default CreateReport;
