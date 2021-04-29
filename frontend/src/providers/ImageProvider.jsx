import React, { createContext, useState, useEffect } from 'react';
import {
    generateCaptionRequest_URL
} from "../api/predictionrequests";

export const ImageContext = createContext({
    filteredImages: [],
    search: "",
    setSearch: () => { },
    aboutDialog: false,
    isLoading: false,
    generateCaption: () => { },
})

const ImageProvider = ({ children }) => {
    const [filteredImages, setFilteredImages] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (filteredImages.length > 0) {
            setFilteredImages([
                ...filteredImages.filter(image =>
                    image.title.includes(search) || image.caption.includes(search)
                )
            ])
        }
    }, [search])

    const generateCaption = (imageUrl) => {
        return generateCaptionRequest_URL({ image: imageUrl });
    }

    return (
        <ImageContext.Provider
            value={{
                filteredImages,
                search,
                setSearch,
                generateCaption,
            }}
        >
            {children}
        </ImageContext.Provider>
    )
}

export default ImageProvider;