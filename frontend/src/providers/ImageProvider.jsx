import React, { createContext, useState, useEffect } from 'react';
import { listImages } from "../api/imagecrud";

export const ImageContext = createContext({
    filteredImages: [],
    search: "",
    setSearch: () => { },
    aboutDialog: false,
    isLoading: false,
    imagesLoading: false,
})

const ImageProvider = ({ children }) => {
    const [filteredImages, setFilteredImages] = useState([]);
    const [search, setSearch] = useState("");
    const [imagesLoading, setImagesLoading] = useState(true);

    useEffect(() => {
        if (filteredImages.length > 0) {
            setFilteredImages([
                ...filteredImages.filter(image =>
                    image.title.includes(search) || image.caption.includes(search)
                )
            ])
        }
    }, [search])

    useEffect(() => {
        (async () => {
            setImagesLoading(true);
            try {
                const response = await listImages();
                if (response.status !== 200) {
                    // error handling
                    setImagesLoading(false);
                    return;
                }
                const imageList = await response.data;
                setFilteredImages([...imageList])
                setImagesLoading(false);
            } catch (e) {
                // handle error
                setImagesLoading(false);
            }
        })()
    }, [])

    return (
        <ImageContext.Provider
            value={{
                filteredImages,
                search,
                setSearch,
                imagesLoading,
            }}
        >
            {children}
        </ImageContext.Provider>
    )
}

export default ImageProvider;