import React, { useContext } from "react";
import ImageProvider, { ImageContext } from "../providers/ImageProvider";

function ImageListContent() {
    const { filteredImages, loadingImages } = useContext(ImageContext);

    console.log(filteredImages);
    return(
        <div></div>
    )
}

const ImageList = () => {
    return (
        <ImageProvider>
            <ImageListContent />
        </ImageProvider>
    )
}
export default ImageList;