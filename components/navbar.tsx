import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { capitalizeFirstLetter } from "../lib/utils";

export default function Header() {

    const session = useSession();
    const name = session.data?.user?.name || "Profile";

    let profileButton;
    if (session.status === "authenticated") {
        profileButton = (
            <>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ cursor: "pointer" }}>
                        { capitalizeFirstLetter(name) }
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" onClick={() => signOut()} style={{ cursor: "pointer" }}>Logout</a></li>
                    </ul>
                </li>
            </>
        )
    } else {
        profileButton = (
            <>
                <Link className="nav-link" href="/auth/login">Login</Link>
            </>
        )
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="#">Salus</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" href={ session.status === "authenticated" ? "/dashboard" : "/" }>{ session.status === "authenticated" ? "Dashboard" : "Home" }</Link>
                            </li>
                            {profileButton}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
