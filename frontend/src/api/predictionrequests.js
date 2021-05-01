import axios from 'axios';

import {
    PREDICTIONS_BASE_URL,
    ENDPOINTS
} from "./constants";

export const generateCaptionRequest_URL = (data) => {
    return axios.post(
        PREDICTIONS_BASE_URL + ENDPOINTS.CAPTION,
        data
    )
        .then(res => res)
        .catch(err => {
            throw new Error(err)
        })
}

export const generateCaptionRequest_FILE = (formData) => {
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