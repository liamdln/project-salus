import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/layout";
import { getReportsAsync } from "../../../lib/reports";

const Reports: NextPage = ({ reports }: any) => {

    reports = JSON.parse(reports);

    const session = useSession();
    const router = useRouter()
    const query = router.query;

    console.log(reports)
    function refreshReports() {
        router.replace(router.asPath);
    }

    return (
        <Layout>
            <div className="container text-center">
                <h1>Reports</h1>
                {/* <span>Query: {query.filter ? query.filter : "None"}</span> */}
                {reports.length < 1 ?
                    <>
                        <div className="mt-3">
                            <span style={{ display: "block" }}>No reports have been made.</span>
                        </div>
                    </>
                    :

                    <table className="table table-hover mt-3">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Type</th>
                                <th scope="col">Description</th>
                                <th scope="col">Author</th>
                                <th scope="col">Location</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report: any, index: number) => {
                                const tableColour = report.severity === 1 ? "table-warning" : report.severity === 2 ? "table-danger" : ""
                                return (
                                    <tr key={index} className={tableColour}>
                                        <th scope="row">{report._id}</th>
                                        <td>
                                            {report.severity === 1 ?
                                                <>
                                                    {report.type} <br />
                                                    <strong>(Danger to Operations)</strong>
                                                </> : report.severity === 2 ?
                                                    <>
                                                        {report.type} <br />
                                                        <strong>(Danger to Life)</strong>
                                                    </> :
                                                    <>
                                                        {report.type}
                                                    </>
                                            }
                                        </td>
                                        <td>{report.description}</td>
                                        <td>{report.author}</td>
                                        <td>{report.location}</td>
                                        <td>Open</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                }
                <button className="btn btn-primary mt-2" onClick={() => refreshReports()}>Refresh</button>
            </div>
        </Layout>
    );
};

export async function getServerSideProps() {
    // get reports
    const rawReports = await getReportsAsync();
    // parse the result of the db call into a string and remove the [] brackets around the object.
    const reports = JSON.stringify(rawReports);
    return { props: { reports } }
}

export default Reports;
