import { NextPage } from "next"
import Head from "next/head";
import Layout from "../../../components/layout";
import { getReportsAsync } from "../../../lib/reports";
import { Report } from "../../../types/reports";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import moment from "moment";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Audit: NextPage = ({ reports }: any) => {

    const allReports: Report[] = JSON.parse(reports);
    const reportsData = {
        types: {
            wildlife: 0,
            fod: 0
        },
        severity: {
            dangerToLife: 0,
            dangerToOps: 0,
            none: 0
        },
        status: {
            open: 0,
            inReview: 0,
            closed: 0,
            archived: 0,
            revoked: 0
        },
        submissionDate: {} as Record<string, number>
    }
    for (const report of allReports) {
        // types
        switch (report.type) {
            case "wildlife":
                reportsData.types.wildlife++;
                break;

            case "fod":
                reportsData.types.fod++;
                break;

            default:
                console.error(`Error getting type of report: ${JSON.stringify(report)}`)
                break;
        }

        // severity
        switch (report.severity) {
            case 2:
                reportsData.severity.dangerToLife++;
                break;

            case 1:
                reportsData.severity.dangerToOps++;
                break;

            case 0:
                reportsData.severity.none++;
                break;

            default:
                console.error(`Error getting type of report: ${JSON.stringify(report)}`)
                break;
        }

        // status
        switch (report.status) {
            case 4:
                reportsData.status.revoked++;
                break;

            case 3:
                reportsData.status.archived++;
                break;

            case 2:
                reportsData.status.closed++;
                break;

            case 1:
                reportsData.status.inReview++;
                break;

            case 0:
                reportsData.status.open++;
                break;

            default:
                console.error(`Error getting type of report: ${JSON.stringify(report)}`)
                break;
        }

        // submission
        reportsData.submissionDate[moment(report.date).format("DD-MM-YYYY")] = reportsData.submissionDate[moment(report.date).format("DD-MM-YYYY")] ? reportsData.submissionDate[moment(report.date).format("DD-MM-YYYY")] + 1 : 1;

    }


    const reportTypes = {
        labels: ["Foreign Object Debris (FOD)", "Wildlife"],
        datasets: [{
            label: "Number of Reports",
            data: [reportsData.types.fod, reportsData.types.wildlife],
            backgroundColor: [
                "#015D52",
                "#E55137"
            ]
        }]
    }

    const reportSeverity = {
        labels: ["None", "Danger to Operations", "Danger to Life"],
        datasets: [{
            label: "Number of Reports",
            data: [reportsData.severity.none, reportsData.severity.dangerToOps, reportsData.severity.dangerToLife],
            backgroundColor: [
                "#1F2937",
                "#E49B0F",
                "#dc3545"
            ]
        }]
    }

    const reportStatus = {
        labels: ["Open", "In Review", "Closed", "Archived", "Revoked"],
        datasets: [{
            label: "Number of Reports",
            data: [reportsData.status.open, reportsData.status.inReview, reportsData.status.closed, reportsData.status.archived, reportsData.status.revoked],
            backgroundColor: [
                "#dc3545",
                "#E49B0F",
                "#198754",
                "#1F2937",
                "#6c757d"
            ]
        }]
    }

    const reportDates = {
        labels: Object.keys(reportsData.submissionDate),
        datasets: [{
            label: "Report Submissions",
            data: Object.values(reportsData.submissionDate),
            backgroundColor: "#FF7514",
            borderColor: "#FF7514"
        }],
    }

    return (
        <>
            <Head>
                <title>Audit - ProjectSalus</title>
            </Head>
            <Layout>
                <div className="container text-center">
                    <h1>Auditing and Statistics</h1>
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h2 className="my-1">
                                Reports Breakdown
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="mb-3">
                                        <h3>Types</h3>
                                        <div className="d-flex justify-content-center" style={{ height: "300px", width: "100%" }}>
                                            <Pie width={"50%"} options={{ maintainAspectRatio: false }} data={reportTypes} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <h3>Severity</h3>
                                        <div className="d-flex justify-content-center" style={{ height: "300px", width: "100%" }}>
                                            <Pie width={"50%"} options={{ maintainAspectRatio: false }} data={reportSeverity} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="mb-3">
                                        <h3>Status</h3>
                                        <div className="d-flex justify-content-center" style={{ height: "300px", width: "100%" }}>
                                            <Pie width={"50%"} options={{ maintainAspectRatio: false }} data={reportStatus} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <h3>Submissions</h3>
                                        <div className="d-flex justify-content-center" style={{ height: "300px", width: "100%" }}>
                                            <Line data={reportDates} options={
                                                {
                                                    scales: {
                                                        y: {
                                                            ticks: {
                                                                stepSize: 1
                                                            }
                                                        }
                                                    }
                                                }
                                            } />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export async function getServerSideProps() {
    // get reports
    const rawReports = await getReportsAsync();
    // parse the result of the db call into a string.
    const reports = JSON.stringify(rawReports);
    return { props: { reports } }
}

export default Audit;