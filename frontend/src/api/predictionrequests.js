import axios from 'axios';

import {
    PREDICTIONS_BASE_URL,
    ENDPOINTS
} from "./constants";

export const generateCaptionRequest = (formData) => {
    return axios.post(
        PREDICTIONS_BASE_URL + ENDPOINTS.CAPTION,
        formData,
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

export const reverseImageSearchRequest = (formData) => {
    return axios.post(
        PREDICTIONS_BASE_URL + ENDPOINTS.SEARCH,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )
        .then(res => res.data)
        .catch(err => {
            throw new Error(err)
        })
}