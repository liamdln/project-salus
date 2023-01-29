import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../../../components/layout";
import { MapArea, MapMarker } from "../../../types/map";
import { readSettings, settings } from "../../../config/settings";

const Map = dynamic(
    () => import("../../../components/map"),
    { ssr: false }
)

const CreateReport: NextPage = (props: Record<string, MapMarker>) => {

    const airportMarker: MapMarker = { lat: props.marker.lat, lng: props.marker.lng, draggable: true }
    const [userLocArea, setUserLocArea] = useState({} as MapArea)
    const [getUserLocBtnBusy, setUserLocBtnBusy] = useState(false);
    const [getUserLocBtnEnabled, setGetUserLocBtnEnabled] = useState(false);
    const reportPostApiUri = "/api/reports/"

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
                fillColour: "red",
                borderColour: "none",
                radius,
                stroke: false
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


    return (
        <Layout>
            <div className="container text-center">
                <h1>Create a Report</h1>
                <div className="text-start" style={{ width: "75%", margin: "auto" }}>
                    <div className="card mt-3 mb-3 bg-dark">
                        <div className="card-body">
                            <form action={reportPostApiUri} method="POST">
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
                                    {userLocArea.centerLat && userLocArea.centerLng ? <Map markers={[airportMarker]} areas={[userLocArea]} /> : <Map markers={[airportMarker]} /> }
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
