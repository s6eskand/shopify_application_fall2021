import React, { createContext, useState, useEffect } from 'react';

export const ImageContext = createContext({
    filteredImages: [],
    search: "",
    setSearch: () => { },
    aboutDialog: false,
    isLoading: false,
    captionLoading: false,
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

    return (
        <ImageContext.Provider
            value={{
                filteredImages,
                search,
                setSearch,
            }}
        >
            {children}
        </ImageContext.Provider>
    )
}

export default ImageProvider;