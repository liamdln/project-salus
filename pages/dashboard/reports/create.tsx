import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/layout";

const CreateReport: NextPage = () => {

    const router = useRouter()

    const Map = dynamic(
        () => import("../../../components/map"),
        { ssr: false }
    )

    return (
        <Layout>
            <div className="container text-center">
                <h1>Create a Report</h1>
                <div className="text-start" style={{ width: "50%", margin: "auto" }}>
                    <div className="card mt-3">
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="severity-select" className="form-label">Severity</label>
                                    <select className="form-select" id="severity-select" aria-label="Severity level">
                                        <option value="0">None Threatening</option>
                                        <option value="1">Danger to Operations</option>
                                        <option value="2">Danger to Life</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="type-select" className="form-label">Type</label>
                                    <select className="form-select" id="type-select" aria-label="Type">
                                        <option value="fod">Foreign Object Debris (FOD)</option>
                                        <option value="wildlife">Wildlife</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea className="form-control" id="description" rows={3} defaultValue={""} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location</label>
                                    <Map />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateReport;
