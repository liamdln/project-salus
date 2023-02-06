import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/layout";
import { getReportsAsync } from "../../../lib/reports";
import { Report } from "../../../types/reports";
import { useSession } from "next-auth/react";
import moment from "moment";
import dynamic from "next/dynamic";
import Loading from "../../../components/loading";

const Map = dynamic(
    () => import("../../../components/map"),
    { ssr: false }
)

const Reports: NextPage = ({ reports }: any) => {

    const session = useSession();

    reports = JSON.parse(reports);

    const router = useRouter()
    const query = router.query;

    function refreshReports() {
        router.replace(router.asPath);
    }

    function Type(props: { type: string }) {
        if (props.type === "fod") {
            return (
                <span>Foreign Object Debris</span>
            )
        } else if (props.type === "wildlife") {
            return (
                <span>Wildlife</span>
            )
        } else {
            return (<></>)
        }
    }

    function TypeAndSeverity(props: { severity: number, type: string }) {
        // Severity:
        // 0: None
        // 1: Danger to operations
        // 2: Danger to life
        if (props.severity === 1) {
            return (
                <div className="d-flex flex-column">
                    <Type type={props.type} />
                    <strong className="text-warning">(Danger to Operations)</strong>
                </div>
            )
        } else if (props.severity === 2) {
            return (
                <div className="d-flex flex-column">
                    <Type type={props.type} />
                    <strong className="text-danger">(Danger to Life)</strong>
                </div>
            )
        } else {
            return (
                <div className="d-flex flex-column">
                    <Type type={props.type} />
                </div>
            )
        }
    }

    function ReportStatus(props: { status: number }) {
        // Status:
        // 0: Open
        // 1: In review
        // 2: Closed
        // 3: Archived
        if (props.status === 0) {
            return (
                <span className="text-success">Open</span>
            )
        } else if (props.status === 1) {
            return (
                <span className="text-warning">In Review</span>
            )
        } else if (props.status === 2) {
            return (
                <span className="text-danger">Closed</span>
            )
        } else if (props.status === 3) {
            return (
                <span className="text-secondary">Archived</span>
            )
        } else {
            return (
                <></>
            )
        }
    }

    function ReportsTable(props: { reports: Report[] }) {
        if (props.reports.length < 1) {
            return (
                <>
                    <div className="mt-3">
                        {query.filter ? <span style={{ display: "block" }}>You have not made any reports.</span> : <span style={{ display: "block" }}>No reports have been made.</span> }
                    </div>
                </>
            )
        }
        return (
            <table className="table table-hover mt-3">
                <thead>
                    <tr>
                        {/* <th scope="col">#</th> */}
                        <th scope="col">Type</th>
                        <th scope="col">Description</th>
                        <th scope="col">Author</th>
                        {/* <th scope="col">Location</th> */}
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {props.reports.map((report: Report, index: number) => {
                        // const tableColour = report.severity === 1 ? "table-warning" : report.severity === 2 ? "table-danger" : ""
                        return (
                            <tr key={index}>
                                {/* <th scope="row">{report._id}</th> */}
                                <td>
                                    <TypeAndSeverity severity={report.severity} type={report.type} />
                                </td>
                                <td>{report.description}</td>
                                <td>{report.author}</td>
                                {/* <td>{report.lat}, {report.lng}</td> */}
                                {/* <td><Map markers={[{ lat: report.lat, lng: report.lng }]} mapHeightPx={200} /></td> */}
                                <td>{moment(report.date).format("DD/MM/YYYY HH:mm:ss")}</td>
                                <td><ReportStatus status={report.status} /></td>
                                <td><button className="btn btn-primary">View</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <Layout>
            <div className="container text-center">
                {query.filter ? <h1>Your Reports</h1> : <h1>All Reports</h1>}
                <ReportsTable reports={query.filter ? reports.filter((report: Report) => report.author === session.data?.user.name) : reports} />
                <button className="btn btn-primary mt-2" onClick={() => refreshReports()}>Refresh</button>
            </div>
        </Layout>
    );
};

export async function getServerSideProps() {
    // get reports
    const rawReports = await getReportsAsync();
    // parse the result of the db call into a string.
    const reports = JSON.stringify(rawReports);
    return { props: { reports } }
}

export default Reports;
