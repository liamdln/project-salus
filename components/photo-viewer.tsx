import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export function PhotoViewer(props: { imageLocations: string[], visible: boolean, setShowImageModal: any }) {

    const [currentImage, setCurrentImage] = useState(0);
    const [maxImages, setMaxImages] = useState(0);
    useEffect(() => {
        setCurrentImage(0);
        setMaxImages(props.imageLocations.length)
    }, [props.imageLocations])

    const filteredImageDirs: string[] = useMemo(() => {
        const newDirs = []
        for (const dir of props.imageLocations) {
            const indexOfPublicFolder = encodeURI(dir).split("%5C").indexOf("public");
            newDirs.push(encodeURI(dir).split("%5C").slice(indexOfPublicFolder + 1).join("/"))
        }
        return newDirs;
    }, [props.imageLocations])

    const moveImage = (shift: number) => {
        setCurrentImage(currentImage + shift);
    }

    const closeModal = () => {
        props.setShowImageModal(false);
    }

    return (
        <div className={`modal ${!props.visible ? "d-none" : ""}`} tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)", height: "100vh" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <span>Image #{currentImage + 1}</span>
                        <button type="button" className="btn-close" aria-label="Close" onClick={(e) => closeModal()} />
                    </div>
                    <div className="modal-body text-center">
                        <div className="d-flex justify-content-center" style={{ height: "700px" }}>
                            {filteredImageDirs.length > 0 ?
                                <Image src={`/${filteredImageDirs[currentImage]}`} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "scale-down" }} alt={`Supporting image #${currentImage + 1}.`} />
                                :
                                <div className="d-flex align-items-center"><em>There are no images associated with this report.</em></div>
                             }
                        </div>
                        <div className="btn-group mt-3">
                            <button type="button" disabled={currentImage <= 0} onClick={() => moveImage(-1)} className="btn btn-light" style={{ width: "5rem" }}><i className="bi bi-arrow-left"></i></button>
                            <button type="button" className="btn btn-light" onClick={() => closeModal()} style={{ width: "5rem" }}>Close</button>
                            <button type="button" disabled={currentImage >= maxImages - 1} onClick={() => moveImage(1)} className="btn btn-light" style={{ width: "5rem" }}><i className="bi bi-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}