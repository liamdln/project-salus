import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import Layout from "../../components/layout";
import "../../styles/Login.module.css"

const Dashboard: NextPage = () => {

    const session = useSession();

    return (
        <Layout>
            <div className="container text-center">
                <h1>Hello {session.data?.user?.name}!</h1>
                <button onClick={() => signOut()} className="btn btn-primary">Logout</button>
            </div>
        </Layout>

    );
};

export default Dashboard;