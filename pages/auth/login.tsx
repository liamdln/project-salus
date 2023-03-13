import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Loading from "../../components/loading";
import Swal from "sweetalert2";
import Head from "next/head";
import { LoginError } from "../../config/auth";

const Login: NextPage = () => {

    // variables
    const [signInButtonLoading, setSignInButtonLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const session = useSession();

    const callback = router.query?.callbackUrl ? router.query.callbackUrl : null;
    const callbackUrl = callback && typeof callback === "string" ? callback : "/dashboard";

    // preload operations 
    if (session.status === "authenticated") {
        router.push(callbackUrl);
    }

    // functions
    function login() {
        setSignInButtonLoading(true);
        signIn("credentials", { email, password, redirect: false, callbackUrl: callbackUrl }).then((res: any) => {
            if (!res.ok) {
                switch (JSON.parse(res.error).errorCode) {
                    case LoginError.ACCOUNT_DISABLED:
                        Swal.fire({
                            icon: "error",
                            title: "That hasn't gone well!",
                            text: "This account is disabled. If you believe this is an error, please contact the site admin.",
                        })
                        break;
                    case LoginError.DATABASE_CONNECTION_FAILED:
                        Swal.fire({
                            icon: "error",
                            title: "That hasn't gone well!",
                            text: "There's been an error connecting to the database. Please report this to the site admin.",
                        })
                        break;
                    case LoginError.INVALID_CREDENTIALS:
                    default:
                        Swal.fire({
                            icon: "error",
                            title: "That hasn't gone well!",
                            text: "Invalid username or password.",
                        })
                        break;

                }
                setSignInButtonLoading(false);
                setEmail("");
                setPassword("");
            }
        });
    }

    let loginButton;

    if (session.status === "loading") {
        loginButton = (
            <>
                <button type="submit" className="btn btn-primary me-10 disabled">
                    <span>
                        Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                </button>
            </>
        )
    } else {
        loginButton = (
            <>
                <button type="submit" onClick={() => { login() }} className={signInButtonLoading ? "btn btn-primary me-10 w-50 disabled" : "btn btn-primary w-50 me-10"}>
                    {!signInButtonLoading ? (
                        <span>
                            Sign In
                        </span>
                    ) : (
                        <span>
                            Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                    )}
                </button>
            </>
        )
    }

    let signInHtml = (
        <>
            <div className="d-flex justify-content-center">
                <form style={{ width: "75%" }} onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                        <label htmlFor="emailBox" className="form-label mb-0">Email</label>
                        <input type="email" value={email} onChange={(e) => { setEmail(e.currentTarget.value) }} className="form-control" id="emailBox" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordBox" className="form-label mb-0">Password</label>
                        <input type="password" value={password} onChange={(e) => { setPassword(e.currentTarget.value) }} className="form-control" id="passwordBox" required />
                    </div>
                    {loginButton}
                </form>
            </div>
        </>
    )

    return (
        <>
            <Head>
                <title>Auth - ProjectSalus</title>
            </Head>
            {session.status === "loading" ? <><div className="container text-center"><Loading /></div></> : <>
                <div style={{ backgroundImage: "url(/images/runway.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "cover", height: "100vh" }}>
                    <div style={{ backgroundColor: "rgba(0,0,0,0.6)", height: "100vh" }}>
                        <div className="container d-flex flex-column justify-content-center text-center" style={{ height: "100vh" }}>
                            <div className="card salus-login">
                                {/* <div className="card-header bg-primary text-white">
                                    <h1 className="my-1">Project<strong>Salus</strong></h1>
                                </div> */}
                                <div className="card-body">
                                    <h2 className="mb-3">Login</h2>
                                    {signInHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </>
    );
};

export default Login;