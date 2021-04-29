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
        .catch(err => console.error(err))
}