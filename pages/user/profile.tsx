import { NextPage } from "next";
import Layout from "../../components/layout";
import { useSession } from "next-auth/react";
import Loading from "../../components/loading";

const Profile: NextPage = () => {

    const session = useSession();
    if (session.status === "loading") {
        return (<Loading />);
    }
    
    const userName = session.data?.user?.name || "";

    return (
        <Layout>
            <h1>Profile</h1>
        </Layout>

    );
};

export default Profile;