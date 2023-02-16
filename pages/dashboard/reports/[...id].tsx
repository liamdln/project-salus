import { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import useSWR from "swr";
import { fetcher } from "../../../lib/utils"
import Swal from "sweetalert2";
import Loading from "../../../components/loading";
import { getCardColourAndSeverity, getStatus, getType } from "../../../lib/reportCards";
import { Comment, Report as ReportType } from "../../../types/reports";
import moment from "moment";
import dynamic from "next/dynamic";
import LoadingMap from "../../../components/loading-map";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const Map = dynamic(
    () => import("../../../components/map"),
    { ssr: false, loading: () => <LoadingMap /> }
)

const Report: NextPage = () => {

    const [postAnonymously, setPostAnonymously] = useState(false);
    const [commentContent, setCommentContent] = useState("");

    const router = useRouter()
    const session = useSession();
    const query = router.query;

    const { data, error, isLoading } = useSWR(query.id ? `/api/reports/${query.id}` : null, fetcher)

    // error getting the data
    if (!router.isReady || (error && !router.isReady) || isLoading) {
        return (
            <Loading />
        )
    } else if (error && router.isReady) {
        Swal.fire({
            icon: "error",
            title: "That hasn't gone well!",
            text: `The report with ID ${query.id || "Unknown"} does not exist.`,
        })
        router.push(`/dashboard/reports${query.filter ? "?filter=own" : ""}`)
        return (
            <Loading />
        )
    }

    const report: ReportType = data;
    const reportDetails = getCardColourAndSeverity(report)
    const reportStatus = getStatus(report.status, true);

    function postComment() {
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
            url: `/api/reports/${report._id}?&context=comment`,
            data: comment
        }).then((res) => {
            setCommentContent("")
            const refreshedComments: Comment[] = res.data.body;
            report.comments = refreshedComments;
        }).catch((err) => {
            console.log(err)
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "Your comment could not be posted. Please try again later or contact the website administrator.",
                footer: "Error: Failed to POST."
            })
        })
    }

    function Comments(props: { comments: Comment[] }) {
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
        <Layout>
            <div className="container text-center mb-3">
                <div className="card">
                    <div className={`card-header bg-${reportDetails.cardColour || "primary"} text-white text-start d-flex justify-content-between`}>
                        <div className="my-3">
                            <h1 style={{ fontWeight: "bold", fontSize: "24px" }} className="mb-0">{getType(report.type)} Report</h1>
                            <h2 style={{ fontSize: "16px" }} className="mb-0">Submitted by {report.author.name} on {moment(report.date).format("DD/MM/YYYY")} at {moment(report.date).format("HH:mm")} </h2>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                            <button onClick={() => { router.push(`/dashboard/reports${query.filter ? "?filter=own" : ""}`) }} className={`btn btn-${reportDetails.cardColour} text-white`} style={{ width: "200px", height: "100%" }}>Back to Reports</button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="mb-2" style={{ margin: "-1rem -1rem 0rem -1rem" }}><Map mapHeightPx={300} markers={[{ lat: report.lat, lng: report.lng }]} mapCenter={{ lat: report.lat, lng: report.lng }} /></div>
                        <span className="d-inline"><strong>Status:</strong> <span className={reportStatus.className}>{reportStatus.content}</span></span>
                        <span className="d-inline"> | </span>
                        <span className="d-inline"><strong>Urgency: </strong><span className={`text-${reportDetails.cardColour || "black"}`}>{reportDetails.severity || "Not urgent"}</span></span>
                        <div className="text-start mt-3">
                            <span><strong>Description: </strong></span>
                            <span>{report.description}</span>
                        </div>
                        <div className="text-center mt-3">
                            <h3>Actions</h3>
                            <div className="mt-2 d-flex justify-content-center">
                                <select className="form-select" aria-label="Change status" style={{ width: "25%" }}>
                                    <option selected={report.status === 0 ? true : false} value="0">Open</option>
                                    <option selected={report.status === 1 ? true : false} value="1">In Review</option>
                                    <option selected={report.status === 2 ? true : false} value="2">Closed</option>
                                    <option selected={report.status === 3 ? true : false} value="3">Archived</option>
                                    <option selected={report.status === 4 ? true : false} value="4">Revoked</option>
                                </select>
                                <button className="btn btn-primary ms-2" style={{ width: "15%" }}>Update Status</button>
                            </div>
                            <div className="mt-2 d-flex justify-content-center">
                                <select className="form-select" aria-label="Change severity" style={{ width: "25%" }}>
                                    <option selected={report.severity === 0 ? true : false} value="0">None</option>
                                    <option selected={report.severity === 1 ? true : false} value="1">Danger to Operations</option>
                                    <option selected={report.severity === 2 ? true : false} value="2">Danger to Life</option>
                                </select>
                                <button className="btn btn-primary ms-2" style={{ width: "15%" }}>Update Urgency</button>
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
                                <button onClick={() => postComment()} className={commentContent ? "btn btn-primary mt-2" : "btn btn-primary mt-2 disabled"} type="button" style={{ width: "20rem" }}>{ postAnonymously ? "Post Comment Anonymously" : "Post Comment" }</button>
                            </div>
                        </div>   
                    </div>
                </div>
            </div>
        </Layout>
    )

}

export default Report;