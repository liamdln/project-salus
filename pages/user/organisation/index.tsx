import { NextPage } from "next";
import Layout from "../../../components/layout";
import { useSession } from "next-auth/react";
import Loading from "../../../components/loading";
import { useRouter } from "next/router";
import Head from "next/head";
import { readSettings } from "../../../lib/settings";
import { Settings } from "../../../types/settings";
import dynamic from "next/dynamic";
import LoadingMap from "../../../components/loading-map";
import { useState } from "react";
import { User } from "next-auth";
import { getUsers } from "../../../lib/users";
import { modifyUserEnabledStatus, saveSettings } from "../../../lib/org-utils";
import { UserEditModal } from "../../../components/user-edit-modal";
import { UserPower } from "../../../config/user";
import Swal from "sweetalert2";

const Map = dynamic(
    () => import("../../../components/map"),
    { ssr: false, loading: () => <LoadingMap /> }
)

const Organisation: NextPage<{ settingsStr: string, usersStr: string }> = ({ settingsStr, usersStr }) => {

    const [saveButtonLoading, setSaveButtonLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContext, setModalContext] = useState("edit" as "edit" | "create");
    const [modalUser, setModalUser] = useState<User | undefined>(undefined);

    const router = useRouter();
    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    } else if (session.status === "unauthenticated") {
        router.push("/auth/login");
    }

    let settings: Settings = JSON.parse(settingsStr);
    let users: User[] = JSON.parse(usersStr);

    function ChangeSettingsCard() {
        return (
            <>
                <h1>Admin Actions</h1>
                <div className="card mb-3">
                    <div className="card-header bg-primary text-white">
                        <span style={{ fontSize: "1.5rem" }}>Change Settings</span>
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => {
                            setSaveButtonLoading(true);
                            setSaveButtonLoading(saveSettings(e, settings._id));
                        }
                        }>
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

    function UsersCard() {
        return (
            <div className="card" style={{ overflow: "scroll" }}>
                <div className="card-header bg-primary text-white">
                    <div className="d-flex justify-content-center position-relative">
                        <span style={{ fontSize: "1.5rem" }}>User Management</span>
                        <div className="salus-org-user-management-create-button" style={{ width: "100%" }}>
                            <button className="btn btn-light"
                                onClick={() => {
                                    setModalVisible(true);
                                    setModalContext("create");
                                    setModalUser(undefined);
                                }}>
                                Create User
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Roles</th>
                                <th scope="col">Notes</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? users.map((user: User, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td>{user.name}</td>
                                        <td>
                                            <div className="d-flex gap-2 justify-content-center">
                                                {/* <span>{hideEmail[index] ? obfuscateString(user.email || "", ["@"]) : user.email}</span> */}
                                                {/* <button type="button" className="btn" onClick={() => setHideEmail({ ...hideEmail, [index]: !hideEmail[index] })}>
                                                    {hideEmail[index] ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                                                </button> */}
                                                {user.email}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-grid gap-2 d-flex justify-content-center mb-1">
                                                {user.roles.length > 0 ?
                                                    user.roles.map((role, index) => {
                                                        let colour = "";
                                                        switch (role.colour) {
                                                            case "red":
                                                                colour = "danger";
                                                                break;

                                                            case "green":
                                                                colour = "success";
                                                                break;

                                                            case "blue":
                                                            default:
                                                                colour = "primary";

                                                        }
                                                        return (

                                                            <span key={index} className={` badge rounded-pill bg-${colour}`} >{role.name}</span>

                                                        )
                                                    })
                                                    :
                                                    <span><em>None</em></span>
                                                }
                                            </div>
                                        </td>
                                        <td>{!user.enabled ? <span className="text-danger"><em>Disabled</em></span> : <></>}</td>
                                        <td>
                                            {user.enabled ?
                                                <button type="button" className="btn salus-disable-button" data-bs-toggle="tooltip" data-bs-placement="top" title="Disable User"
                                                    disabled={session.data?.user._id === user._id} onClick={() => {
                                                    modifyUserEnabledStatus(user, false);
                                                }}>
                                                    <i className="bi bi-slash-circle"></i>
                                                </button>
                                                :
                                                <button type="button" className="btn salus-edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="Enable User" onClick={() => {
                                                    modifyUserEnabledStatus(user, true);
                                                }}>
                                                    <i className="bi bi-check-circle"></i>
                                                </button>
                                            }
                                            <button type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit User"
                                                onClick={() => {
                                                    setModalVisible(true);
                                                    setModalContext("edit");
                                                    setModalUser(user);
                                                    if (user?._id === session.data?.user._id) {
                                                        Swal.fire({
                                                            icon: "info",
                                                            text: "You will be logged out after editing your profile.",
                                                        })
                                                    }
                                                }
                                                }>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                                :
                                <span><em>No users exist</em></span>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    function ManagementCards() {
        // check permissions
        if ((session.data?.user.maxPower || 0) === UserPower.ADMIN) {
            // user is admin
            return (
                <>
                    <ChangeSettingsCard />
                    <UsersCard />
                </>
            )
        }
        else if ((session.data?.user.maxPower || 0) === UserPower.MANAGER) {
            // user is manager and or admin
            return (
                <UsersCard />
            )
        } else {
            // user has no roles or is a member
            return (<></>)
        }
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
                    <div className="mt-3 mb-5">
                        <ManagementCards />
                        <UserEditModal context={modalContext} modalVisible={modalVisible} user={modalUser} setModalVisible={setModalVisible} />
                    </div>
                </div>
            </Layout>
        </>


    );
};

export async function getServerSideProps() {
    const [settings, users] = await Promise.all([
        readSettings(),
        getUsers()
    ])
    return { props: { settingsStr: JSON.stringify(settings), usersStr: JSON.stringify(users) } }
}

export default Organisation;