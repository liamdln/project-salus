import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/layout";
import { getReportsAsync } from "../../../lib/reports";
import { Report } from "../../../types/reports";
import { useSession } from "next-auth/react";
import moment from "moment";
import Loading from "../../../components/loading";
import Link from "next/link";
import { displayMessage, getCardColourAndSeverity, getStatus, getType } from "../../../lib/reportCards";
import Head from "next/head";

const messageLimit = 200;

const Reports: NextPage = ({ reports }: any) => {

    const session = useSession();
    const router = useRouter();
    if (session.status === "loading") {
        return (<Loading />);
    }

    const query = router.query;
    reports = JSON.parse(reports);

    function refreshReports() {
        router.push(router.asPath);
    }

    function ReportCards(props: { reports: Report[] }) {
        return (
            <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                {props.reports.map((report: Report, index: number) => {
                    const cardDetails = getCardColourAndSeverity(report)
                    const reportStatus = getStatus(report.status, false, "white")
                    return (
                        <div key={index} className="col">
                            <div className={`card h-100 bg-${cardDetails.cardColour} text-white`}>
                                <div className="card-body d-flex flex-column justify-content-center">
                                    <h1 className="mb-0" style={{ fontSize: "20px" }}><strong>{getType(report.type)} Report</strong></h1>
                                    <span>Submitted by: {report.author.name}</span>
                                    <span>on {moment(report.date).format("DD/MM/YYYY")} at {moment(report.date).format("HH:mm")}</span>
                                    <p className="mt-3 mb-0">{displayMessage(report.description, messageLimit)}</p>
                                    <span className="mt-3 mb-0">Status: <strong><span className={reportStatus.className}>{reportStatus.content}</span></strong></span>
                                    {cardDetails.severity ? <p className="text-white mb-0">Severity: <strong>{cardDetails.severity}</strong></p> : <></>}
                                    <Link href={{
                                        pathname: `/dashboard/reports/${report._id}`,
                                        query: query.filter ? "filter=own" : ""
                                    }} className={`btn btn-${cardDetails.cardColour} mt-3 text-white`}>View Report</Link>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{query.filter ? "Your Reports - Project Salus" : "All Reports - Project Salus"}</title>
            </Head>
            <Layout>
                <div className="container text-center">
                    {query.filter ? <h1>Your Reports</h1> : <h1>All Reports</h1>}
                    {!reports || reports.length < 1 ?
                        <>
                            <div className="mt-3">
                                {query.filter ? <span style={{ display: "block" }}>You have not made any reports.</span> : <span style={{ display: "block" }}>No reports have been made.</span>}
                            </div>
                        </>
                        :
                        <ReportCards reports={query.filter ? reports.filter((report: Report) => (report.author.id || "") === session.data?.user.id) : reports} />
                    }

                    <button className="btn btn-primary mt-3" onClick={() => refreshReports()}>Refresh</button>
                </div>
            </Layout>
        </>

    );
};

export async function getServerSideProps() {
    // get reports
    const reports = await getReportsAsync();

    // parse the result of the db call into a string.
    const reportsString = JSON.stringify(reports);
    return { props: { reports: reportsString } }
}

export default Reports;

// function ReportsTable(props: { reports: Report[] }) {
    //     if (props.reports.length < 1) {
    //         return (
    //             <>
    //                 <div className="mt-3">
    //                     {query.filter ? <span style={{ display: "block" }}>You have not made any reports.</span> : <span style={{ display: "block" }}>No reports have been made.</span>}
    //                 </div>
    //             </>
    //         )
    //     }
    //     return (
    //         <table className="table table-hover mt-3">
    //             <thead>
    //                 <tr>
    //                     {/* <th scope="col">#</th> */}
    //                     <th scope="col">Type</th>
    //                     <th scope="col">Description</th>
    //                     <th scope="col">Author</th>
    //                     {/* <th scope="col">Location</th> */}
    //                     <th scope="col">Date</th>
    //                     <th scope="col">Status</th>
    //                     <th scope="col"></th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {props.reports.map((report: Report, index: number) => {
    //                     // const tableColour = report.severity === 1 ? "table-warning" : report.severity === 2 ? "table-danger" : ""
    //                     return (
    //                         <tr key={index}>
    //                             {/* <th scope="row">{report._id}</th> */}
    //                             <td>
    //                                 <TypeAndSeverity severity={report.severity} type={report.type} />
    //                             </td>
    //                             <td>{displayMessage(report.description)}</td>
    //                             <td>{report.author}</td>
    //                             {/* <td>{report.lat}, {report.lng}</td> */}
    //                             {/* <td><Map markers={[{ lat: report.lat, lng: report.lng }]} mapHeightPx={200} /></td> */}
    //                             <td>{moment(report.date).format("DD/MM/YYYY HH:mm")}</td>
    //                             <td><ReportStatus showColour={ true } status={report.status} /></td>
    //                             <td><button className="btn btn-primary">View</button></td>
    //                         </tr>
    //                     );
    //                 })}
    //             </tbody>
    //         </table>
    //     )
    // }

// function TypeAndSeverity(props: { severity: number, type: string }) {
//     // Severity:
//     // 0: None
//     // 1: Danger to operations
//     // 2: Danger to life
//     if (props.severity === 1) {
//         return (
//             <div className="d-flex flex-column">
//                 {getType(props.type)}
//                 <strong className="text-warning">(Danger to Operations)</strong>
//             </div>
//         )
//     } else if (props.severity === 2) {
//         return (
//             <div className="d-flex flex-column">
//                 {getType(props.type)}
//                 <strong className="text-danger">(Danger to Life)</strong>
//             </div>
//         )
//     } else {
//         return (
//             <div className="d-flex flex-column">
//                 {getType(props.type)}
//             </div>
//         )
//     }
// }