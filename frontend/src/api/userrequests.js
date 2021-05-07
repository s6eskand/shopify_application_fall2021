import {
    ENDPOINTS,
    BASE_URL,
    REACT_APP_URL
} from "./constants";
import axios from "axios";

export const getUserProfileByUsername = (username) => {
    return axios.get(
        BASE_URL + ENDPOINTS.USER.USERNAME + username
    )
        .then(res => res)
        .catch(err => err)
}

export const getUserAccount = (token) => {
    return axios.get(
        BASE_URL + ENDPOINTS.USER.ACCOUNT,
        {
            headers: {
                "Authorization": `Token ${token}`
            }
        }
    )
        .then(res => res)
        .catch(err => err)
}

export const getUserAccountProxy = () => {
    return axios.get(
        REACT_APP_URL + ENDPOINTS.USER.PROXY_ACCOUNT
    )
        .then(res => res)
        .catch(err => err)
}

export const updateUserSettings = (data) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    return axios.put(
        BASE_URL + ENDPOINTS.USER.ACCOUNT,
        data,
        {
            headers: {
                "Authorization": `Token ${token}`
            }
        }
    )
        .then(res => res)
        .catch(err => err)
}