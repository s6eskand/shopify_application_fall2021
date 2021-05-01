import axios from "axios";
import {
    BASE_URL,
    ENDPOINTS
} from "./constants";

export const listImagesRequest = () => {
    return axios.get(
        BASE_URL + ENDPOINTS.IMAGES
    )
        .then(res => res)
        .catch(err => {
            throw new Error(err)
        })
}

export const createImageRequest = (data) => {
    return axios.post(
        BASE_URL + ENDPOINTS.IMAGES,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )
        .then(res => res)
        .catch(err => {
            throw new Error(err)
        })
}