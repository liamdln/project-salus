import { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import useSWR from "swr";
import { fetcher } from "../../../lib/utils"
import Swal from "sweetalert2";
import Loading from "../../../components/loading";
import { getCardColourAndSeverity, getStatus, getType } from "../../../lib/reportCards";
import { Report as ReportType } from "../../../types/reports";
import moment from "moment";
import dynamic from "next/dynamic";
import LoadingMap from "../../../components/loading-map";

const Map = dynamic(
    () => import("../../../components/map"),
    { ssr: false, loading: () => <LoadingMap /> }
)

const Report: NextPage = () => {

    const router = useRouter()
    const query = router.query;
    const { data, error, isLoading } = useSWR(`/api/reports/${query.id}`, fetcher)

    // error getting the data
    if (error) {
        Swal.fire({
            icon: "error",
            title: "That hasn't gone well!",
            text: `The report with ID ${query.id || "Unknown"} does not exist.`,
        })
        router.push("/dashboard/reports");
    }
    else if (isLoading) {
        return (
            <Loading />
        )
    }

    const report: ReportType = data[0];
    const reportDetails = getCardColourAndSeverity(report)
    const reportStatus = getStatus(report.status, true);
    console.log(report)

    return (
        <Layout>
            <div className="container text-center">
                <div className="card">
                    <div className={`card-header bg-${reportDetails.cardColour || "primary"} text-white text-start d-flex justify-content-between`}>
                        <div className="my-3">
                            <h1 style={{ fontWeight: "bold", fontSize: "24px" }} className="mb-0">{getType(report.type)} Report</h1>
                            <h2 style={{ fontSize: "16px" }} className="mb-0">Submitted by {report.author} on {moment(report.date).format("DD/MM/YYYY")} at {moment(report.date).format("HH:mm")} </h2>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                            <button onClick={() => { router.back() }} className={`btn btn-${reportDetails.cardColour} text-white`} style={{ width: "200px", height: "100%" }}>Back to Reports</button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="mb-2" style={{ margin: "-1rem -1rem 0rem -1rem" }}><Map mapHeightPx={300} markers={[{ lat: report.lat, lng: report.lng }]} mapCenter={{ lat: report.lat, lng: report.lng }} /></div>
                        <span>Status: <span className={reportStatus.className}>{reportStatus.content}</span></span>
                        <span className="d-block mb-3"><strong>Urgency: </strong><span className={`text-${reportDetails.cardColour || "black"}`}>{reportDetails.severity || "Not urgent"}</span></span>
                        <div className="text-start">
                            <span><strong>Description: </strong></span>
                            <span>"{report.description}"</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )

}

export default Report;