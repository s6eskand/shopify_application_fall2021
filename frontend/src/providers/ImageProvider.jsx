import React, { createContext, useContext, useEffect, useState } from 'react';
import { listImagesRequest, createImageRequest } from "../api/imagecrud";
import { generateCaptionRequest, reverseImageSearchRequest } from "../api/predictionrequests";
import { AlertContext } from "./AlertProvider";

export const ImageContext = createContext({
    imageList: [],
    search: "",
    handleSearch: () => { },
    aboutDialog: false,
    isLoading: false,
    imagesLoading: false,
    generateCaption: () => { },
    captionLoading: false,
    createImageLoading: false,
    openDialog: false,
    setOpenDialog: () => { },
    createImage: () => { },
    showImageSearch: false,
    setShowImageSearch: () => { },
    reverseImageSearch: () => { },
})

const ImageProvider = ({ children }) => {
    const { openAlertSnackbar } = useContext(AlertContext)
    const [imageList, setImageList] = useState([]);
    const [search, setSearch] = useState("");
    const [imagesLoading, setImagesLoading] = useState(false);
    const [captionLoading, setCaptionLoading] = useState(false);
    const [createImageLoading, setCreateImageLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [showImageSearch, setShowImageSearch] = useState(false);

    useEffect(() => {
        (async () => {
            await listImages()
        })()
    }, [])

    const listImages = async () => {
        setImagesLoading(true);
        const response = await listImagesRequest();
        if (response.status === 200) {
            const images = await response.data;
            setImageList([...images])
            setImagesLoading(false);
        } else {
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

    const createImage = async (data, isProfilePicture) => {
        setCreateImageLoading(true);
        try {
            const query = isProfilePicture ? "?dp=True" : ""
            await createImageRequest(data, query);
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

    const reverseImageSearch = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("images", JSON.stringify(imageList));
        try {
            const response = await reverseImageSearchRequest(formData);
            const matched = new Set(response.similar_images);
            const test = [...imageList.filter(image => matched.has(image.pk))]
            setImageList(test)
            setShowImageSearch(false);
        } catch {
            openAlertSnackbar(
                "error",
                5000,
                "Oops! Something went wrong. Please try again.",
                "Something went wrong..."
            )
        }

    }

    const handleSearch = (newVal) => {
        setSearch(newVal);
    }

    return (
        <ImageContext.Provider
            value={{
                imageList,
                setImageList,
                search,
                handleSearch,
                imagesLoading,
                generateCaption,
                captionLoading,
                createImageLoading,
                openDialog,
                setOpenDialog,
                createImage,
                showImageSearch,
                setShowImageSearch,
                reverseImageSearch
            }}
        >
            {children}
        </ImageContext.Provider>
    )
}

export default ImageProvider;