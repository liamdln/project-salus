import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import "../../styles/Login.module.css"

const Login: NextPage = () => {

    // variables
    const [signInButtonLoading, setSignInButtonLoading] = useState(false);
    // const [signOutButtonLoading, setSignOutButtonLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const session = useSession();

    // preload operations 
    if (session.status === "authenticated") {
        router.push("/dashboard");
    }

    // functions
    function login() {
        setSignInButtonLoading(true);
        const loginRes: any = signIn("credentials", { email, password, redirect: false, callbackUrl: "/dashboard" });
        if (loginRes.error) {
            console.log(loginRes.error)
        }
    }

    let loginForm;

    // if (session.status === "authenticated") {
    //     loginForm = (
    //         <>
    //             <button type="button" onClick={() => { logout() }} className={signOutButtonLoading ? "btn btn-primary me-10 disabled" : "btn btn-primary me-10"}>
    //                 {!signOutButtonLoading ? (
    //                     <span>
    //                         Sign Out
    //                     </span>
    //                 ) : (
    //                     <span>
    //                         Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
    //                     </span>
    //                 )}
    //             </button>
    //         </>
    //     )
    // }
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
                    { loginForm }
                </form>
            </div>
        </>
    )

    return (
        <>
            {session.status === "loading" ? <><div className="container text-center"><span>Loading...</span></div></> : <>
                <main>
                    <div className="container text-center mt-5 pb-2" style={{ backgroundColor: "#957dad", color: "white", borderRadius: "25px" }}>
                        <div className="pt-3">
                            <h1>Login - Salus</h1>
                            {session.status === "unauthenticated" ? <><h2 style={{ fontSize: "24px" }}>Please login below:</h2></> : <></>}
                        </div>
                        {signInHtml}
                    </div>
                </main>
            </>}
        </>
    );
};

export default Login;