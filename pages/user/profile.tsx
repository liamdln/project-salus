import { NextPage } from "next";
import Layout from "../../components/layout";
import { useSession } from "next-auth/react";
import Loading from "../../components/loading";
import { readSettings } from "../../config/settings";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

// fake data
const fakeData = {
    roles: [
        {
            name: "Administrator",
            colour: "red",
        },
        {
            name: "Manager",
            colour: "green",
        },
        {
            name: "Member",
            colour: "blue",
        }
    ]
}

const Profile: NextPage = ({ settingsStr }: any) => {

    const router = useRouter();
    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    } else if (session.status === "unauthenticated") {
        router.push("/auth/login");
    }

    const userName = session.data?.user?.name || "";
    const settings = JSON.parse(settingsStr);

    function isAdmin() {
        for (const role of fakeData.roles) {
            if (role.name === "Administrator") {
                return true;
            }
        }
        return false;
    }

    function deleteAccount() {
        if (!isAdmin()) {
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "You cannot delete the admin account."
            })
        } else {
            Swal.fire({
                title: "Are you sure?",
                text: "Once the account has been deleted, it cannot be recovered. All reports created by this account will persist as anonymous reports.",
                showCancelButton: true,
                confirmButtonText: "Delete Account",
                confirmButtonColor: "#dc3545",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Saved!', '', 'success')
                }
            })
        }
    }

    return (
        <Layout>
            <div className="text-center">
                <h1>Profile</h1>
                <div className="card" style={{ width: "50%", margin: "auto" }}>
                    <div className="card-body">
                        <div>
                            <div>
                                <p className="mb-0" style={{ fontSize: "32px" }}>{userName}</p>
                                <p className="mb-2">{settings.airport.name}</p>
                            </div>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-4">
                                {fakeData.roles.map((role, index) => {
                                    let colour = "";
                                    switch (role.colour) {
                                        case "red":
                                            colour = "danger";
                                            break;

                                        case "green":
                                            colour = "success";
                                            break;

                                        default:
                                            colour = "primary";

                                    }
                                    return (
                                        <span key={index} className={`badge rounded-pill bg-${colour}`}>{role.name}</span>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            {/* <h2 style={{ fontSize: "24px" }}>Actions</h2>
                            <div>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
                                    <button type="button" className="btn btn-primary">Change Name</button>
                                    <button type="button" className="btn btn-primary">Change Email</button>
                                    <button type="button" className="btn btn-danger" onClick={() => deleteAccount()}>Delete Account</button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    );
};

export async function getServerSideProps() {
    const settingsStr = JSON.stringify(await readSettings());
    return { props: { settingsStr } }
}

export default Profile;
