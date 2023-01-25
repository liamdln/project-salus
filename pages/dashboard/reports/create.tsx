import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Layout from "../../../components/layout";
import { MapMarker } from "../../../types/map";

const CreateReport: NextPage = () => {

    const Map = dynamic(
        () => import("../../../components/map"),
        { ssr: false }
    )

    // const [userLocation, setUserLocation] = useState({ lat: "", lng: "" });
    const [marker, setMarker] = useState({} as MapMarker)

    // if we are on server (typeof window will = undefined), set true to keep className prop the same on both,
    // else, check if the browser supports handing us the user's location
    const getLocButton = typeof window !== "undefined" ? "geolocation" in navigator : true;

    function getUserLocation() {
        // get the location
        navigator.geolocation.getCurrentPosition((location: Record<string, any>) => {
            const lat = location.coords.latitude;
            const lng = location.coords.longitude;
            // setUserLocation({ lat, lng })
            setMarker({lat, lng, message: "Your approx location."})
        })

    }


    return (
        <Layout>
            <div className="container text-center">
                <h1>Create a Report</h1>
                <div className="text-start" style={{ width: "75%", margin: "auto" }}>
                    <div className="card mt-3 mb-3 bg-dark">
                        <div className="card-body">
                            <form>
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
                                    <textarea className="form-control" id="description" rows={3} defaultValue={""} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location</label>
                                    <button type="button" onClick={() => getUserLocation()} className={getLocButton ? "btn btn-primary mb-3" : "d-none"} style={{ display: "block" }}>Get current location</button>
                                    <Map>

                                    </Map>
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

export default CreateReport;
