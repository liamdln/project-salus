import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Loading from "../../components/loading";

const Login: NextPage = () => {

    // variables
    const [signInButtonLoading, setSignInButtonLoading] = useState(false);
    // const [signOutButtonLoading, setSignOutButtonLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [invalidLogin, setInvalidLogin] = useState(false);
    const [loginError, setLoginError] = useState("");

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
                    case 1:
                        setLoginError("There's been an error connecting to the database. Please report this to the site admin.")
                        break;
                    case 0:
                    default:
                        setLoginError("The username or password that you entered is incorrect.")
                        break;

                }
                setInvalidLogin(true);
                setSignInButtonLoading(false);
                setEmail("");
                setPassword("");
            }
        });
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
                <button type="button" onClick={() => { login() }} className={signInButtonLoading ? "btn btn-primary me-10 w-50 disabled" : "btn btn-primary w-50 me-10"}>
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
                <form style={{ width: "50%" }}>
                    <div className="mb-3">
                        <label htmlFor="emailBox" className="form-label">Email</label>
                        <input type="email" value={email} onChange={(e) => { setEmail(e.currentTarget.value) }} className="form-control" id="emailBox" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordBox" className="form-label">Password</label>
                        <input type="password" value={password} onChange={(e) => { setPassword(e.currentTarget.value) }} className="form-control" id="passwordBox" required />
                    </div>
                    { loginForm }
                </form>
            </div>
        </>
    )

    return (
        <>
            {session.status === "loading" ? <><div className="container text-center"><Loading /></div></> : <>
                <main>
                    <div className="container text-center mt-5 p-3 bg-dark" style={{ borderRadius: "25px" }}>
                        <div>
                            <h1>Login - Salus</h1>
                            {session.status === "unauthenticated" ? <><h2 style={{ fontSize: "24px" }}>Please login below:</h2></> : <></>}
                            <div className={invalidLogin ? "alert alert-danger mx-auto mt-3" : "d-none"} style={{ width: "50%" }} role="alert">
                                { loginError }
                            </div>
                        </div>
                        {signInHtml}
                    </div>
                </main>
            </>}
        </>
    );
};

export default Login;