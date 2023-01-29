import { signOut } from "next-auth/react"
import { useRouter } from "next/router"

export default function Loading() {

    const router = useRouter()
    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h1 className="mt-2" style={{ fontSize: "20px" }}>Loading...</h1>
                <span>If this screen persists, try the below options:</span>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                    <button className="btn btn-primary" type="button" onClick={() => router.reload()}>Reload the Page</button>
                    <button className="btn btn-primary" type="button" onClick={() => signOut()}>Sign Out</button>
                </div>
            </div>
        </>
    )

}