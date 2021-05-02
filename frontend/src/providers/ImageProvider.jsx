import React, { createContext, useContext, useState, useEffect } from 'react';
import { listImagesRequest, createImageRequest } from "../api/imagecrud";
import { generateCaptionRequest } from "../api/predictionrequests";
import { AlertContext } from "./AlertProvider";

export const ImageContext = createContext({
    filteredImages: [],
    search: "",
    setSearch: () => { },
    aboutDialog: false,
    isLoading: false,
    imagesLoading: false,
    generateCaption: () => { },
    captionLoading: false,
    createImageLoading: false,
    openDialog: false,
    setOpenDialog: () => { },
    createImage: () => { },
    listImages: () => { },
})

const ImageProvider = ({ children }) => {
    const { openAlertSnackbar } = useContext(AlertContext)
    const [filteredImages, setFilteredImages] = useState([]);
    const [search, setSearch] = useState("");
    const [imagesLoading, setImagesLoading] = useState(false);
    const [captionLoading, setCaptionLoading] = useState(false);
    const [createImageLoading, setCreateImageLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (filteredImages.length > 0) {
            setFilteredImages([
                ...filteredImages.filter(image =>
                    image.title.includes(search) || image.caption.includes(search)
                )
            ])
        }
    }, [search])

    const listImages = async () => {
        setImagesLoading(true);
        try {
            const response = await listImagesRequest();
            const imageList = await response.data;
            setFilteredImages([...imageList])
            setImagesLoading(false);
        } catch {
            openAlertSnackbar(
                "error",
                5000,
                "Oops! Something went wrong. Please try again.",
                "Something went wrong..."
            )
            setImagesLoading(false);
        }
    }

    const generateCaption = async (data) => {
        setCaptionLoading(true);
        try {
            const response = await generateCaptionRequest(data);
            if (response.status === 400) {
                openAlertSnackbar(
                    "error",
                    5000,
                    "Please send a valid image URL"
                )
                return;
            }
            const { generated_caption } = await response.data;
            setCaptionLoading(false);
            return generated_caption;
        } catch {
            openAlertSnackbar(
                "error",
                5000,
                "Oops! Something went wrong. Please try again.",
                "Something went wrong..."
            )
            setCaptionLoading(false);
        }
    }

    const createImage = async (data) => {
        setCreateImageLoading(true);
        try {
            await createImageRequest(data);
            setCreateImageLoading(false);
            return true;
        } catch {
            openAlertSnackbar(
                "error",
                5000,
                "Oops! Something went wrong. Please try again.",
                "Something went wrong..."
            )
            setCreateImageLoading(false);
            return false;
        }
    }

    return (
        <ImageContext.Provider
            value={{
                filteredImages,
                search,
                setSearch,
                imagesLoading,
                generateCaption,
                captionLoading,
                createImageLoading,
                openDialog,
                setOpenDialog,
                createImage,
                listImages
            }}
        >
            {children}
        </ImageContext.Provider>
    )
}

export default ImageProvider;