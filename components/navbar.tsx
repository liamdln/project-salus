import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { capitalizeFirstLetter } from "../lib/string-utils";
import { useRouter } from "next/router";
import { FormEvent } from "react";

export default function Header() {

    const session = useSession();
    const router = useRouter();
    const name = session.data?.user?.name || "Profile";

    // handle the logout submit event
    function logout(e: FormEvent) {
        e.preventDefault();
        signOut();
        router.push("/auth/logout")
    }

    let profileButton;
    let reportsButton;
    if (session.status === "authenticated") {
        // authenticated view
        profileButton = (
            <>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ cursor: "pointer" }}>
                        { capitalizeFirstLetter(name) }
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><Link className="dropdown-item" href="/user/profile">Profile</Link></li>
                        <li><Link className="dropdown-item" href="/user/organisation">Organisation</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link href="" type="button" className="dropdown-item" onClick={(e) => logout(e)} style={{ cursor: "pointer" }}>Logout</Link></li>
                    </ul>
                </li>
            </>
        )
        reportsButton = (
            <>
                <li className="nav-item dropdown">
                    <Link href="" type="button" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ cursor: "pointer" }}>
                        Reports
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><Link className="dropdown-item" href="/dashboard/reports/create">Create Report</Link></li>
                        <li><Link className="dropdown-item" href="/dashboard/reports?filter=own">View Your Reports</Link></li>
                        <li><Link className="dropdown-item" href="/dashboard/reports">View All Reports</Link></li>
                        <li><Link className="dropdown-item" href="/dashboard/reports/audit">Statistics and Auditing</Link></li>
                    </ul>
                </li>
            </>
        )
    } else {
        // unauthenticated view
        profileButton = (
            <>
                <Link className="nav-link" href="/auth/login">Login</Link>
            </>
        )
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark navbar-blue">
                <div className="container">
                    <Link className="navbar-brand" href="/" style={{ color: "#e9ecef" }}>Project<strong>Salus</strong></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" href={ session.status === "authenticated" ? "/dashboard" : "/" }>{ session.status === "authenticated" ? "Dashboard" : "Home" }</Link>
                            </li>
                            { reportsButton }
                            {profileButton}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
