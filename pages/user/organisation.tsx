import { NextPage } from "next";
import Layout from "../../components/layout";
import { useSession } from "next-auth/react";
import Loading from "../../components/loading";
import { useRouter } from "next/router";
import Head from "next/head";
import { readSettings } from "../../config/settings";
import { Settings } from "../../types/settings";
import dynamic from "next/dynamic";
import LoadingMap from "../../components/loading-map";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Map = dynamic(
    () => import("../../components/map"),
    { ssr: false, loading: () => <LoadingMap /> }
)

const Organisation: NextPage = ({ settingsStr }: any) => {

    const [saveButtonLoading, setSaveButtonLoading] = useState(false);

    const router = useRouter();
    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    } else if (session.status === "unauthenticated") {
        router.push("/auth/login");
    }

    let settings: Settings = JSON.parse(settingsStr);

    function isAdmin() {
        if (!session.data) { return false; }
        for (const role of session.data.user.roles) {
            if (role.name === "Admin") {
                return true;
            }
        }
        return false;
    }

    function saveSettings(e: any) {
        setSaveButtonLoading(true);
        e.preventDefault();
        const newSettings: Settings = {
            airport: {
                name: e.target["ad-name"].value,
                iata: e.target["iata-code"].value,
                icao: e.target["icao-code"].value
            },
            map: {
                zoomLevel: parseInt(e.target["zoom-level"].value),
                circleRadius: parseInt(e.target["range-ring-rad"].value),
                xAxisCenter: parseFloat(e.target["coords-lat"].value),
                yAxisCenter: parseFloat(e.target["coords-lng"].value)
            }
        }

        if (isNaN(newSettings.map.zoomLevel) ||
            isNaN(newSettings.map.circleRadius) ||
            isNaN(newSettings.map.xAxisCenter) ||
            isNaN(newSettings.map.yAxisCenter)) {

            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "The settings you have entered do not match the expected types. Ensure you did not enter a letter or word where a number is expected.",
            })
            setSaveButtonLoading(false);
            return;

        }

        axios({
            method: "POST",
            url: `/api/settings`,
            data: { id: settings._id, payload: newSettings }
        }).then(() => {
            router.replace(router.asPath);
            Swal.fire({
                icon: "success",
                text: "Settings have been saved.",
            })
            setSaveButtonLoading(false);
        }).catch((err) => {
            console.log(err)
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "The settings could not be saved. Please try again later, or contact the website administrator.",
                footer: "Error: Failed to POST."
            })
            setSaveButtonLoading(false);
        })
    }

    function ChangeSettingsCard(props: { settings: Settings }) {
        if (!isAdmin) {
            return (<></>)
        }
        return (
            <>
                <h1>Admin Actions</h1>
                <div className="card mb-5">
                    <div className="card-header bg-primary text-white">
                        <span style={{ fontSize: "1.5rem" }}>Change Settings</span>
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => saveSettings(e)}>
                            {/* start airport settings */}
                            <p style={{ fontSize: "1.5rem" }}>Airport Settings</p>
                            <hr />

                            <div style={{ display: "flex", gap: "1rem" }}>
                                <div className="text-start" style={{ flexGrow: "1" }}>
                                    <label htmlFor="ad-name" className="form-label ms-1">Name</label>
                                    <input type="text" className="form-control" id="ad-name" defaultValue={settings.airport.name} required />
                                </div>
                                <div className="text-start" style={{ maxWidth: "25%" }}>
                                    <label htmlFor="icao-code" className="form-label ms-1">ICAO Code</label>
                                    <input type="text" className="form-control" id="icao-code" defaultValue={settings.airport.icao} required />
                                </div>
                                <div className="text-start" style={{ maxWidth: "25%" }}>
                                    <label htmlFor="iata-code" className="form-label ms-1">IATA Code</label>
                                    <input type="text" className="form-control" id="iata-code" defaultValue={settings.airport.iata} required />
                                </div>
                            </div>
                            {/* end airport settings */}
                            {/* start map settings */}
                            <hr />
                            <p style={{ fontSize: "1.5rem" }}>Map Settings</p>
                            <hr />

                            <div className="text-start">
                                <label htmlFor="coords" className="form-label ms-1">Centre Coordinates</label>
                                <div className="d-flex mb-3" style={{ gap: "1rem" }}>
                                    <div className="input-group">
                                        <span className="input-group-text">LAT</span>
                                        <input type="text" id="coords-lat" className="form-control" aria-label="LAT Coordinates" defaultValue={settings.map.xAxisCenter} />
                                    </div>
                                    <div className="input-group">
                                        <span className="input-group-text">LNG</span>
                                        <input type="text" id="coords-lng" className="form-control" aria-label="LNG Coordinates" defaultValue={settings.map.yAxisCenter} />
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex" style={{ gap: "1rem" }}>
                                        <div style={{ flexGrow: "1" }}>
                                            <label htmlFor="range-ring-rad" className="form-label ms-1">Centre Ring Radius</label>
                                            <div className="input-group">
                                                <input type="text" id="range-ring-rad" className="form-control" aria-label="Centre Ring Radius" defaultValue={settings.map.circleRadius} />
                                                <span className="input-group-text">metres</span>
                                            </div>
                                        </div>
                                        <div style={{ flexGrow: "1" }}>
                                            <label htmlFor="zoom-level" className="form-label ms-1">Zoom Level</label>
                                            <input type="text" id="zoom-level" className="form-control" aria-label="Zoom Level" defaultValue={settings.map.zoomLevel} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* end map settings */}
                            <div className="text-end">
                                <button className="btn btn-primary mt-3" style={{ minWidth: "20%" }} disabled={saveButtonLoading} type="submit">{saveButtonLoading ? "Loading..." : "Save Settings"}</button>
                            </div>
                        </form>
                    </div >
                </div >
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Organisation - ProjectSalus</title>
            </Head>
            <Layout>
                <div className="container text-center">
                    <h1 className="mb-3">Organisation</h1>
                    <div className="d-flex" style={{ flexWrap: "wrap", gap: "1rem" }}>
                        <div className="card" style={{ width: "calc(50% - 0.5rem)" }}>
                            <div className="card-body">
                                <Map mapHeightPx={500} />
                            </div>
                        </div>
                        <div className="card" style={{ width: "calc(50% - 0.5rem)" }}>
                            <div className="card-body d-flex flex-column justify-content-center">
                                <h2 className="mb-1">{settings.airport.name}</h2>
                                <span>{settings.airport.iata} | {settings.airport.icao}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <ChangeSettingsCard settings={settings} />
                    </div>
                </div>
            </Layout>
        </>


    );
};

export async function getServerSideProps() {
    const settingsStr = JSON.stringify(await readSettings());
    return { props: { settingsStr } }
}

export default Organisation;