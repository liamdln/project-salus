import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Login: NextPage = () => {

    // variables
    const [signInButtonLoading, setSignInButtonLoading] = useState(false);
    // const [signOutButtonLoading, setSignOutButtonLoading] = useState(false);

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
        const loginRes: any = signIn("credentials", { email, password, redirect: false, callbackUrl: callbackUrl });
        if (loginRes.error) {
            console.log(loginRes.error)
        }
    }

    let loginForm;

    if (session.status === "loading") {
        loginForm = (
            <>
                <button type="button" className="btn btn-primary me-10 disabled">
                    <span>
                        Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                </button>
            </>
        )
    } else {
        loginForm = (
            <>
                <button type="button" onClick={() => { login() }} className={signInButtonLoading ? "btn btn-primary me-10 w-100 disabled" : "btn btn-primary w-100 me-10"}>
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
                <form className="pt-3" style={{ width: "50%" }}>
                    <div className="mb-3">
                        <label htmlFor="emailBox" className="form-label">Email</label>
                        <input type="email" value={email} onChange={(e) => { setEmail(e.currentTarget.value) }} className="form-control" id="emailBox" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordBox" className="form-label">Password</label>
                        <input type="password" value={password} onChange={(e) => { setPassword(e.currentTarget.value) }} className="form-control" id="passwordBox" required />
                    </div>
                    {loginForm}
                </form>
            </div>
        </>
    )

    return (
        <>
            {session.status === "loading" ? <><div className="container text-center"><span>Loading...</span></div></> : <>
                <main>
                    <div className="container text-center mt-5 pb-3">
                        <div className="card salus-card">
                            <div className="card-header">
                                <h1>Login to Salus</h1>
                            </div>
                            <div className="card-body">
                                <h2>Please login below:</h2>
                                {signInHtml}
                            </div>
                        </div>
                    </div>
                </main>
            </>}
        </>
    );
};

export default Login;