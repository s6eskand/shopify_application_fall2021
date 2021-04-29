import axios from "axios";
import {
    BASE_URL,
    ENDPOINTS
} from "./constants";

export const listImages = () => {
    return axios.get(
        BASE_URL + ENDPOINTS.IMAGES
    )
        .then(res => res)
        .catch(err => console.error(err))
}