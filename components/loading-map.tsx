
export default function LoadingMap() {

    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h1 className="mt-2" style={{ fontSize: "20px" }}>Loading the map...</h1>
            </div>
        </>
    )

}