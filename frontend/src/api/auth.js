import {
    ENDPOINTS,
    BASE_URL
} from "./constants";
import axios from 'axios';

export const loginRequest = (data) => {
    return axios.post(
        BASE_URL + ENDPOINTS.AUTH.LOGIN,
        data
    )
        .then(res => res.data)
        .catch(err => {
            throw new Error(err)
        })
}

export const registerRequest = (data) => {
    return axios.post(
        BASE_URL + ENDPOINTS.AUTH.REGISTER,
        data
    )
        .then(res => res.data)
        .catch(err => {
            throw new Error(err)
        })
}

export const logoutRequest = () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    return axios.post(
        BASE_URL + ENDPOINTS.AUTH.LOGOUT,
        {},
        {
            headers: {
                "Authorization": `Token ${token}`
            }
        }
    )
        .then(res => res)
        .catch(err => err)
}