import { NextPage } from "next";
import Layout from "../../components/layout";
import { useSession } from "next-auth/react";

const Profile: NextPage = () => {

    const session = useSession();
    const userName = session.data?.user?.name || "";

    return (
        <Layout>
            <h1>Profile</h1>
        </Layout>

    );
};

export default Profile;