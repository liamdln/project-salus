import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";

const Landing: NextPage = () => {

    const [signInButtonLoading, setSignInButtonLoading] = useState(false);
    const [signOutButtonLoading, setSignOutButtonLoading] = useState(false);

    function login() {
        setSignInButtonLoading(true);
        signIn("credentials", { callbackUrl: '/' })
    }

    function logout() {
        setSignOutButtonLoading(true);
        signOut();
    }

    const session = useSession();

    let signInHtml;

    if (session.status === "authenticated") {
        signInHtml = (
            <>
                <div className="text-white fs-5 fw-bold mb-3">Logged in as SOMEONE</div>
                <button type="button" onClick={() => { logout() }} className={signOutButtonLoading ? "btn btn-primary me-10 disabled" : "btn btn-primary me-10"}>
                    {!signOutButtonLoading ? (
                        <span>
                            Sign Out
                        </span>
                    ) : (
                        <span>
                            Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                    )}
                </button>
            </>
        )
    } else if (session.status === "loading") {
        signInHtml = (
            <>
                <button type="button" className="btn btn-primary me-10 disabled">
                    <span>
                        Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                </button>
            </>
        )
    } else {
        signInHtml = (
            <>
                <button type="button" onClick={() => { login() }} className={signInButtonLoading ? "btn btn-primary me-10 disabled" : "btn btn-primary me-10"}>
                    {!signInButtonLoading ? (
                        <span>
                            Login with VATSIM
                        </span>
                    ) : (
                        <span>
                            Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                    ) }
                </button>
            </>
        )
    }

    return (
        <>
            <main>
                <div>
                { signInHtml }
                </div>
                <div>
                {JSON.stringify(session)}
                </div>
            
            </main>
        </>
    );
};

export default Landing;