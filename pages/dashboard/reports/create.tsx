import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../../../components/layout";
import { MapArea, MapMarker } from "../../../types/map";
import { readSettings } from "../../../config/settings";
import { Report } from "../../../types/reports";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'
import Loading from "../../../components/loading";

const Map = dynamic(
    () => import("../../../components/map"),
    { ssr: false }
)

const CreateReport: NextPage = (props: Record<string, MapMarker>) => {

    const router = useRouter();
    const [reportMarker, setReportMarker] = useState({ lat: props.marker.lat, lng: props.marker.lng, draggable: true } as MapMarker)
    const [userLocArea, setUserLocArea] = useState({} as MapArea)
    const [getUserLocBtnBusy, setUserLocBtnBusy] = useState(false);
    const [getUserLocBtnEnabled, setGetUserLocBtnEnabled] = useState(false);
    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
    const [submitAnonymously, setSubmitAnonymously] = useState(false);

    useEffect(() => {
        setGetUserLocBtnEnabled("geolocation" in navigator)
    }, [])

    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    }

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
            setUserLocBtnBusy(false);
        })

    }

    // form data
    async function submitReport(event: any) {
        event.preventDefault();
        let anonReport = false;
        setSubmitButtonLoading(true);
        let report: Report;

        if (!session.data?.user) {
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "We could not submit this report. Please try again later or contact the website administrator.",
                footer: "Error: No user in session."
            })
            throw new Error("No user in session.")
        }

        report = {
            severity: +event.target["severity-select"].value,
            type: event.target["type-select"].value,
            description: event.target.description.value,
            authorId: "",
            status: 0,
            lat: reportMarker.lat,
            lng: reportMarker.lng,
            date: new Date()
        }

        if (submitAnonymously) {
            report.authorId = "anon"
        } else {
            report.authorId = session.data.user.id;
        }

        fetch("/api/reports", {
            method: "POST",
            body: JSON.stringify(report)
        }).then((res) => {
            if (!res.ok) {
                throw new Error(`Posting report was not successful. Server returned: ${res.status}.`)
            }
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "The report has been submitted!",
                confirmButtonText: "Done",
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    setSubmitButtonLoading(false);
                    router.reload();
                }
            })
        }).catch((err) => {
            console.log(err)
            setSubmitButtonLoading(false);
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "We could not submit this report. Please try again later or contact the website administrator.",
                footer: "Error: Failed to POST."
            })
        })
    }

    return (
        <Layout>
            <div className="container text-center">
                <h1>Create a Report</h1>
                <div className="text-start" style={{ width: "75%", margin: "auto" }}>
                    <div className="card mt-3 mb-3">
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
                                    {userLocArea.centerLat && userLocArea.centerLng ? <Map reportMarker={reportMarker} userArea={userLocArea} updateMarkerPosFunction={setReportMarker} mapHeightPx={500} /> : <Map reportMarker={reportMarker} updateMarkerPosFunction={setReportMarker} mapHeightPx={500} />}
                                </div>
                                <span className="d-block mb-3">
                                    <div className="form-check">
                                        <input onChange={() => setSubmitAnonymously(!submitAnonymously)} className="form-check-input" type="checkbox" value="" id="anon-submit-check" />
                                        <label className="form-check-label" htmlFor="anon-submit-check">
                                            Submit anonymously
                                        </label>
                                    </div>
                                </span>
                                <button type="submit" className={submitButtonLoading ? "btn btn-primary disabled" : "btn btn-primary"}>{submitButtonLoading ? <>Please wait...</> : <>Submit</>}</button>
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
