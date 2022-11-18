import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";

const Landing: NextPage = () => {

    const [signInButtonLoading, setSignInButtonLoading] = useState(false);
    const [signOutButtonLoading, setSignOutButtonLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function redirectAfterLogin() {
        // will route to the authorized only area.
        // if route === auth then push "/authorized" or "/dashboard"
    }

    function login() {
        console.log(email);
        console.log(password);
        setSignInButtonLoading(true);
        const loginRes: any = signIn("credentials", { email, password, redirect: false, callbackUrl: "/" });
        loginRes.error ? console.log(loginRes.error) : redirectAfterLogin();
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

    return (
        <>
            <main>
                <div className="container">
                    <div style={{ width: "25%" }}>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="emailBox" className="form-label">Email</label>
                                <input type="email" value={email} onChange={(e) => { setEmail(e.currentTarget.value) }} className="form-control" id="emailBox" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="passwordBox" className="form-label">Password</label>
                                <input type="password" value={password} onChange={(e) => { setPassword(e.currentTarget.value) }} className="form-control" id="passwordBox" required />
                            </div>
                            {signInHtml}
                        </form>
                    </div>
                    <div>
                        <p>{JSON.stringify(session)}</p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Landing;