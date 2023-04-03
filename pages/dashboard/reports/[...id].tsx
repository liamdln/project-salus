import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import Swal from "sweetalert2";
import Loading from "../../../components/loading";
import { getCardColourAndSeverity, getStatus, getType } from "../../../lib/report-card-utils";
import { Comment, Report as ReportType } from "../../../types/reports";
import moment from "moment";
import dynamic from "next/dynamic";
import LoadingMap from "../../../components/loading-map";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Head from "next/head";
import { PhotoViewer } from "../../../components/photo-viewer";
import { UserPower } from "../../../config/user";
import useSWR from "swr";
import { fetcher } from "../../../lib/api";

const Map = dynamic(
    () => import("../../../components/map"),
    { ssr: false, loading: () => <LoadingMap /> }
)

export function Report() {

    const [postAnonymously, setPostAnonymously] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [updatedStatus, setUpdatedStatus] = useState(0);
    const [updatedSeverity, setUpdatedSeverity] = useState(0);
    const [updateStatusButtonLoading, setUpdateStatusButtonLoading] = useState(false);
    const [updateSeverityButtonLoading, setUpdateSeverityButtonLoading] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [report, setReport] = useState<ReportType>();

    const router = useRouter()
    const session = useSession();
    const { filter } = router.query;

    useEffect(() => {
        if (!router.isReady) return;
        getReport(router.query.id);
    }, [router.isReady])

    const getReport = (reportId: string | string[] | undefined) => {
        fetcher(`/api/reports/${reportId}`).then((report) => {
            setReport(report);
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: `The report with ID ${router.query.id || "Unknown"} does not exist.`,
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push(`/dashboard/reports${router.query.filter ? "?filter=own" : ""}`)
                }
            })
            return (
                <Loading />
            )
        })
    }

    if (!report) {
        return (<Loading />)
    }

    let reportDetails = getCardColourAndSeverity(report)
    let reportStatus = getStatus(report.status, true);

    const postComment = () => {
        const comment: Comment = {
            author: {
                name: postAnonymously ? "Anonymous" : session.data?.user.name || "Unknown",
                id: postAnonymously ? "" : session.data?.user.id,
            },
            content: commentContent,
            date: new Date()
        }

        axios({
            method: "POST",
            url: `/api/reports/${report._id}`,
            data: comment
        }).then((res) => {
            setCommentContent("")
            const refreshedComments: Comment[] = res.data.body;
            report.comments = refreshedComments;
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "Your comment could not be posted. Please try again later or contact the website administrator.",
                footer: "Error: Failed to POST."
            })
        })
    }

    const updateStatus = () => {
        setUpdateStatusButtonLoading(true)
        const data = { status: updatedStatus }
        axios({
            method: "PATCH",
            url: `/api/reports/${report._id}?&context=status`,
            data
        }).then((res) => {
            const refreshedStatus: number = res.data.body;
            report.status = refreshedStatus;
            reportDetails = getCardColourAndSeverity(report)
            setUpdateStatusButtonLoading(false)
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "The status of the report could not be updated. Please try again later or contact the website administrator.",
                footer: "Error: Failed to POST."
            })
            setUpdateStatusButtonLoading(false)
        })
    }

    const updateSeverity = () => {
        setUpdateSeverityButtonLoading(true);
        const data = { severity: updatedSeverity }
        axios({
            method: "PATCH",
            url: `/api/reports/${report._id}?&context=severity`,
            data
        }).then((res) => {
            const refreshedSeverity: number = res.data.body;
            report.severity = refreshedSeverity;
            reportDetails = getCardColourAndSeverity(report)
            setUpdateSeverityButtonLoading(false);
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "The severity of the report could not be updated. Please try again later or contact the website administrator.",
                footer: "Error: Failed to POST."
            })
            setUpdateSeverityButtonLoading(false);
        })
    }

    const Comments = (props: { comments: Comment[] }) => {
        // comment ids need to be returned by the server
        return (
            <>
                {props.comments.map((comment: Comment, index: number) => {
                    return (
                        <div className="card card-body mb-3" key={index} id={comment._id}>
                            <div className="row">
                                <div className="col">
                                    <div className="text-start d-flex flex-column ps-3">
                                        <span>#{comment._id}</span>
                                        <span>{comment.content}</span>
                                        <span className="fst-italic text-secondary">- {comment.author.name}, {moment(comment.date).format("DD/MM/YYYY")} at {moment(comment.date).format("HH:mm")}</span>
                                    </div>
                                </div>
                                <div className="col-auto d-flex flex-column justify-content-center">
                                    {/* <button type="button" className="btn btn-secondary me-3">Reply</button> */}
                                </div>
                            </div>
                        </div>
                    )
                })
                }
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Report View - ProjectSalus</title>
            </Head>
            <Layout>
                <PhotoViewer imageLocations={report.imageDirectories || []} visible={showImageModal} setShowImageModal={setShowImageModal} />
                <div className="container text-center mb-3">
                    <div className="card">
                        <div className={`card-header bg-${reportDetails.cardColour || "primary"} text-white text-start d-flex justify-content-between`}>
                            <div className="my-3">
                                <h1 style={{ fontWeight: "bold", fontSize: "24px" }} className="mb-0">{getType(report.type)} Report</h1>
                                <h2 style={{ fontSize: "16px" }} className="mb-0">Submitted by {report.author.name} on {moment(report.date).format("DD/MM/YYYY")} at {moment(report.date).format("HH:mm")} </h2>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <button onClick={() => { router.push(`/dashboard/reports${filter ? "?filter=own" : ""}`) }} className={`btn btn-${reportDetails.cardColour} text-white`} style={{ width: "200px", height: "100%" }}>Back to Reports</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="mb-2" style={{ margin: "-1rem -1rem 0rem -1rem" }}><Map mapHeightPx={300} markers={[{ lat: report.lat, lng: report.lng }]} mapCenter={{ lat: report.lat, lng: report.lng }} /></div>
                            <span className="d-inline"><strong>Status:</strong> <span className={reportStatus.className}>{reportStatus.content}</span></span>
                            <span className="d-inline"> | </span>
                            <span className="d-inline"><strong>Urgency: </strong><span className={`text-${reportDetails.cardColour || "black"}`}>{reportDetails.severity || "Not urgent"}</span></span>
                            <div className="d-flex flex-column gap-3">
                                <div className="text-center mt-3">
                                    <h3>Description</h3>
                                    <span>{report.description}</span>
                                </div>
                                <div className="align-self-center">
                                    <button className="btn btn-primary" style={{ width: "15rem" }} onClick={() => setShowImageModal(true)}>View Evidence</button>
                                </div>
                            </div>
                            <div className={report.author.id === session.data?.user.id || (session.data?.user.maxPower || 0) >= UserPower.MANAGER ? "text-center mt-3" : "d-none"} >
                                <div className="mt-2 d-flex flex-column salus-report-actions-box">
                                    <h3>Actions</h3>
                                    <div className="d-flex justify-content-center">
                                        <select onChange={(e) => setUpdatedStatus(+e.currentTarget.value)} defaultValue={report.status} className="form-select align-self-center" aria-label="Change status">
                                            <option value="0">Open</option>
                                            <option value="1">In Review</option>
                                            <option value="2">Closed</option>
                                            <option value="3">Archived</option>
                                            <option value="4">Revoked</option>
                                        </select>
                                        <button onClick={() => updateStatus()} className="btn btn-primary ms-2 align-self-center" disabled={updateStatusButtonLoading} style={{ width: "10rem" }}>
                                            {updateStatusButtonLoading ? "Loading..." : "Update Status"}
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-center mt-2">
                                        <select onChange={(e) => setUpdatedSeverity(+e.currentTarget.value)} defaultValue={report.severity} className="form-select align-self-center" aria-label="Change severity">
                                            <option value="0">None</option>
                                            <option value="1">Danger to Operations</option>
                                            <option value="2">Danger to Life</option>
                                        </select>
                                        <button onClick={() => updateSeverity()} className="btn btn-primary ms-2 align-self-center" disabled={updateSeverityButtonLoading} style={{ width: "10rem" }}>
                                            {updateSeverityButtonLoading ? "Loading..." : "Update Urgency"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h3 style={{ fontSize: "24px" }}>Comments</h3>
                        {report.comments && report.comments.length > 0 ?
                            <div className="mb-3">
                                <Comments comments={report.comments} />
                            </div>
                            :
                            <div className="mb-3">
                                <span>No one has commented.</span>
                            </div>
                        }
                        <div className="card card-body">
                            <div className="text-start">
                                <textarea onChange={(e) => setCommentContent(e.currentTarget.value)} value={commentContent} className="form-control" id="comment-box" placeholder="Enter a comment..." rows={3} />
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="text-start">
                                        <div className="form-check">
                                            <input onChange={() => setPostAnonymously(!postAnonymously)} className="form-check-input" type="checkbox" value="" id="anon-post-check" />
                                            <label className="form-check-label text-secondary fst-italic" htmlFor="anon-post-check">
                                                Post Anonymously
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto d-flex flex-column justify-content-center">
                                    <button onClick={() => postComment()} className={commentContent ? "btn btn-primary mt-2" : "btn btn-primary mt-2 disabled"} type="button" style={{ width: "20rem" }}>{postAnonymously ? "Post Comment Anonymously" : "Post Comment"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )

}

export default Report;