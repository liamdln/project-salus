import { NextPage } from "next";
import Layout from "../../components/layout";
import { useSession } from "next-auth/react";
import Loading from "../../components/loading";
import { readSettings } from "../../lib/settings";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Head from "next/head";

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
    const roles = session.data?.user.roles || [];

    function isAdmin() {
        if (!session.data) { return false; }
        for (const role of session.data.user.roles) {
            if (role.name === "Admin") {
                return true;
            }
        }
        return false;
    }

    return (
        <>
            <Head>
                <title>Profile - ProjectSalus</title>
            </Head>
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
                                <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-1">
                                    {roles.length < 1 ?
                                        <span>User does not belong to any roles.</span>
                                        :
                                        roles.map((role, index) => {
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
                                </div>
                            </div> */}
                            </div>
                        </div>
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

export default Profile;
