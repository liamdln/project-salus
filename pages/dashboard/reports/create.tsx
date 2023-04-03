import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../../../components/layout";
import { MapArea, MapMarker } from "../../../types/map";
import { readSettings } from "../../../lib/settings";
import { FileUploadRes, Report } from "../../../types/reports";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'
import Loading from "../../../components/loading";
import Head from "next/head";
import { shortenString } from "../../../lib/string-utils";
import axios from "axios";

const Map = dynamic(
    () => import("../../../components/map"),
    { ssr: false }
)

// const CreateReport: NextPage = (props: Record<string, MapMarker>) => {
export function CreateReport(props: Record<string, MapMarker>) {

    // hooks and state
    const router = useRouter();
    const [reportMarker, setReportMarker] = useState({ lat: props.marker.lat, lng: props.marker.lng, draggable: true } as MapMarker)
    const [userLocArea, setUserLocArea] = useState({} as MapArea)
    const [getUserLocBtnBusy, setUserLocBtnBusy] = useState(false);
    const [getUserLocBtnEnabled, setGetUserLocBtnEnabled] = useState(false);
    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
    const [submitAnonymously, setSubmitAnonymously] = useState(false);
    const [files, setFiles] = useState<FileUploadRes[]>([]);

    const [reportForm, setReportForm] = useState({
        severity: 0,
        type: "fod",
        description: ""
    })

    useEffect(() => {
        setGetUserLocBtnEnabled("geolocation" in navigator)
    }, [])

    // authentication
    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    }

    // supporting functions
    const handleInputChange = (field: string) => (e: any) => {
        const fieldValue = e.target.value;
        setReportForm({ ...reportForm, [field]: fieldValue });
    }

    const handleImageUpload = (e: any) => {
        // TODO: really this should do done after the report is created and then a link should be created.
        // for now is okay.
        const formData = new FormData();
        formData.append(e.target.name, e.target.files[0])

        // TODO: move to common api lib
        axios("/api/reports/images", {
            method: "POST",
            data: formData,
            headers: { "content-type": "multipart/form-data" }
        }).then((res) => {
            setFiles([...files, {
                originalFileName: res.data.payload.originalFilename,
                newFileName: res.data.payload.newFilename,
                serverDir: res.data.payload.filepath
            }])
        }).catch(() => {
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "The file could not be uploaded. Please try again later or contact the website administrator.",
            })
        })
    }

    const removeFile = (fileIndex: number) => {
        // TODO: move to common api lib
        axios(`/api/reports/images/delete?name=${files[fileIndex].newFileName}`, {
            method: "DELETE",
        }).then(() => {
            // see https://beta.reactjs.org/learn/updating-arrays-in-state#updating-arrays-without-mutation
            const filesCopy = [...files.slice(0, fileIndex), ...files.slice(fileIndex + 1)];
            setFiles(filesCopy);
        }).catch(() => {
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "The file could not be deleted. Please try again later or contact the website administrator.",
            })
        })
    }

    const getUserLocation = () => {
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
    const submitReport = () => {
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
            severity: +reportForm.severity,
            type: reportForm.type,
            description: reportForm.description,
            author: {
                name: ""
            },
            status: 0,
            lat: reportMarker.lat,
            lng: reportMarker.lng,
            date: new Date(),
            imageDirectories: files.map((file: FileUploadRes) => {
                // return the directory from the file but slice off everything up to /restricted.
                // so /salus/public/restricted/images/... would return /restricted/images/...
                return file.serverDir.slice(file.serverDir.indexOf("restricted"), file.serverDir.length);
            })
        }

        if (submitAnonymously) {
            report.author.name = "Anonymous";
        } else {
            report.author.id = session.data.user.id;
            report.author.name = session.data.user.name || "Unknown";
        }

        // TODO: replace with common api lib, use axios
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
            setSubmitButtonLoading(false);
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "We could not submit this report. Please try again later or contact the website administrator.",
                footer: "Error: Failed to POST."
            })
        })
    }

    // template
    return (
        <>
            <Head>
                <title>Create Report - ProjectSalus</title>
            </Head>
            <Layout>
                <div className="container container-md text-center">
                    <h1>Create a Report</h1>
                    <div className="text-start">
                        <div className="card mt-3 mb-3">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="severity-select" className="form-label">Severity</label>
                                    <select value={reportForm.severity} onChange={handleInputChange("severity")} className="form-select" id="severity-select" aria-label="Severity level">
                                        <option value="0">None Threatening</option>
                                        <option value="1">Danger to Operations</option>
                                        <option value="2">Danger to Life</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="type-select" className="form-label">Type</label>
                                    <select value={reportForm.type} onChange={handleInputChange("type")} className="form-select" id="type-select" aria-label="Type">
                                        <option value="fod">Foreign Object Debris (FOD)</option>
                                        <option value="wildlife">Wildlife</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea value={reportForm.description} onChange={handleInputChange("description")} className="form-control" id="description" rows={3} required />
                                </div>
                                <div className="d-block mb-3">
                                    <label className="form-label d-block">Evidence</label>
                                    <div className="card card-body mb-2 d-flex flex-column" style={{ border: "solid 1px #EBEEF2", borderRadius: "0.375rem" }}>
                                        {files && files.length > 0 ?
                                            files.map((file: FileUploadRes, index: number) => {
                                                return (
                                                    <div key={index} className="d-flex justify-content-between gap-2 w-100">
                                                        <span className="d-flex align-items-center">{shortenString(file.originalFileName, screen.width / 40)}</span>
                                                        {/* <button type="button" className="btn"><i className="bi bi-eye"></i> View</button> */}
                                                        <button type="button" className="btn" onClick={() => { removeFile(index) }}><i className="bi bi-trash"></i> Remove</button>
                                                    </div>
                                                )
                                            })
                                            :
                                            <em>No files selected.</em>
                                        }
                                    </div>
                                    <span className="text-secondary d-block"><em>Image size must not exceed 10MB</em></span>
                                    <label className="btn btn-primary mt-2" htmlFor="img-upload">Upload Image</label>
                                    <input type="file" accept="image/*" name="evidence" id="img-upload" onChange={(e) => handleImageUpload(e)} hidden />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location</label>
                                    {getUserLocBtnBusy ?
                                        <button type="button" className={getUserLocBtnEnabled ? "btn btn-primary mb-3 disabled" : "d-none"} style={{ display: "block" }}>Please wait...</button> :
                                        <button type="button" onClick={() => getUserLocation()} className={getUserLocBtnEnabled ? "btn btn-primary mb-3" : "d-none"} style={{ display: "block" }}>Get current location</button>
                                    }
                                    {userLocArea.centerLat && userLocArea.centerLng ? <Map reportMarker={reportMarker} userArea={userLocArea} updateMarkerPosFunction={setReportMarker} mapHeightPx={500} /> : <Map reportMarker={reportMarker} updateMarkerPosFunction={setReportMarker} mapHeightPx={500} />}
                                </div>
                                <div className="d-block mb-3">
                                    <div className="form-check">
                                        <input onChange={() => setSubmitAnonymously(!submitAnonymously)} className="form-check-input" type="checkbox" value="" id="anon-submit-check" />
                                        <label className="form-check-label" htmlFor="anon-submit-check">
                                            Submit anonymously
                                        </label>
                                    </div>
                                </div>
                                <button type="button" onClick={() => submitReport()} className={submitButtonLoading ? "btn btn-primary disabled" : "btn btn-primary"}>{submitButtonLoading ? <>Please wait...</> : <>Submit</>}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export async function getServerSideProps() {
    const mapSettings = await readSettings("map");
    const marker: MapMarker = { lat: mapSettings.map.xAxisCenter, lng: mapSettings.map.yAxisCenter }
    return { props: { marker } }
}

export default CreateReport;
