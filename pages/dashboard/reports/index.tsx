import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/layout";
import { getReports } from "../../../lib/reports";
import { Report } from "../../../types/reports";
import { useSession } from "next-auth/react";
import moment from "moment";
import Loading from "../../../components/loading";
import Link from "next/link";
import { getCardColourAndSeverity, getStatus, getType } from "../../../lib/report-card-utils";
import Head from "next/head";
import { shortenString } from "../../../lib/string-utils";

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
                                    <p className="mt-3 mb-0">{shortenString(report.description, messageLimit)}</p>
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
    const reports = await getReports();

    // parse the result of the db call into a string.
    const reportsString = JSON.stringify(reports);
    return { props: { reports: reportsString } }
}

export default Reports;