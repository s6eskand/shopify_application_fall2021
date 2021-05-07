import axios from "axios";
import {
    BASE_URL,
    ENDPOINTS
} from "./constants";

export const listImagesRequest = () => {
    return axios.get(
        BASE_URL + ENDPOINTS.IMAGES.LIST
    )
        .then(res => res)
        .catch(err => err)
}

export const createImageRequest = (data, query) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    return axios.post(
        BASE_URL + ENDPOINTS.IMAGES.CREATE + query,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Token ${token}`
            }
        }
    )
        .then(res => res)
        .catch(err => {
            throw new Error(err)
        })
}

export const retrieveImageByTitle = (title) => {
    return axios.get(
        BASE_URL + ENDPOINTS.IMAGES.RETRIEVE + title
    )
        .then(res => res)
        .catch(err => err)
}

export const updateLikesOrShares = (data) => {
    return axios.post(
        BASE_URL + ENDPOINTS.IMAGES.LIKE_OR_UPDATE,
        data
    )
        .then(res => res)
        .catch(err => err)
}