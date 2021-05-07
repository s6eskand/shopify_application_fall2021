import {
    ENDPOINTS,
    BASE_URL, REACT_APP_URL
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

export const loginProxyRequest = (data) => {
    return axios.post(
        REACT_APP_URL + ENDPOINTS.AUTH.PROXY_LOGIN,
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

export const registerProxyRequest = (data) => {
    return axios.post(
        REACT_APP_URL + ENDPOINTS.AUTH.PROXY_REGISTER,
        data
    )
        .then(res => res.data)
        .catch(err => {
            throw new Error(err)
        })
}

export const logoutRequest = (token) => {
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

export const logoutProxyRequest = () => {
    return axios.post(
        REACT_APP_URL + ENDPOINTS.AUTH.PROXY_LOGOUT,
        {}
    )
        .then(res => res)
        .catch(err => err)
}