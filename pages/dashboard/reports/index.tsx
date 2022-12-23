import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/layout";

const Reports: NextPage = ({ reports }: any) => {

    const session = useSession();
    const router = useRouter()
    const query = router.query;

    return (
        <Layout>
            <div className="container text-center">
                <h1>Reports</h1>
                {/* <span>Query: {query.filter ? query.filter : "None"}</span> */}
                {reports.length < 1 ?
                    <>
                        <div className="mt-3">
                            <span style={{ display: "block" }}>No reports have been made.</span>
                            <button className="btn btn-primary mt-2">Check Again</button>
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
                                        <th scope="row">{report.id}</th>
                                        <td>
                                        { report.severity === 1 ? 
                                            <>
                                                { report.type } <br />
                                                <strong>(Danger to Operations)</strong>
                                            </> : report.severity === 2 ?
                                            <>
                                                { report.type } <br />
                                                <strong>(Danger to Life)</strong>
                                            </> :
                                            <>
                                                { report.type }
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
            </div>
        </Layout>
    );
};

export async function getServerSideProps() {
    // get reports
    const reports = [{
        id: 1,
        type: "TEST",
        severity: 0,
        description: "Test report",
        author: "Liam P",
        location: "some_location",
    },
    {
        id: 2,
        type: "WILDLIFE",
        severity: 1,
        description: "Birds spotted parallel to 04/22 about halfway down.",
        author: "Liam P",
        location: "co-ords-1",
    },
    {
        id: 3,
        type: "FOD",
        severity: 2,
        description: "Stranded OPS vehicle near threshold 10.",
        author: "Liam P",
        location: "co-ords-2",
    }]
    // const reports: any[] = [];
    return { props: { reports } }
}

export default Reports;