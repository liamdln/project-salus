import { signOut } from "next-auth/react"
import { useRouter } from "next/router"

export default function Loading() {

    const router = useRouter()
    return (
        <>
            {/* <div className="d-flex flex-column min-vh-100">
                <div className="mx-auto">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h1 className="mt-2 -self-center" style={{ fontSize: "40px" }}>Project<strong>Salus</strong></h1>
                </div>
                <div className="d-flex flex-column text-center mt-auto mb-3">
                    <span>If this screen persists, try the below options:</span>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
                        <button className="btn btn-primary" type="button" onClick={() => router.reload()}>Reload the Page</button>
                        <button className="btn btn-primary" type="button" onClick={() => signOut()}>Sign Out</button>
                    </div>
                </div>
            </div> */}
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
                <h1 className="mt-2 breathe-text pb-5" style={{ fontSize: "40px" }}>Project<strong>Salus</strong></h1>
                <span>If this screen persists, try the below options:</span>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
                    <button className="btn btn-primary" type="button" onClick={() => router.reload()}>Reload the Page</button>
                    <button className="btn btn-primary" type="button" onClick={() => signOut()}>Sign Out</button>
                </div>
            </div>
        </>
    )

}