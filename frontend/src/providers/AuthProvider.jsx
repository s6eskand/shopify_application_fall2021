import React, { createContext, useContext, useEffect, useState } from "react";
import {
    loginRequest,
    registerRequest,
    logoutRequest
} from "../api/auth";
import { AlertContext } from "./AlertProvider";

export const AuthContext = createContext({
    user: {},
    isAuthenticated: false,
    token: null,
    loading: false,
    login: () => { },
    register: () => { },
    logout: () => { }
})

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const { openAlertSnackbar } = useContext(AlertContext);

    useEffect(() => {
        const auth = localStorage.getItem("AUTHENTICATION_STATUS");
        if (auth) {
            setIsAuthenticated(true);
            setToken(localStorage.getItem("AUTH_TOKEN"));
            setUser(localStorage.getItem("USER"));
        }
    }, [])

    const login = async (username, password) => {
        setLoading(true);
        const data = {
            username,
            password
        }

        try {
            const response = await loginRequest(data);
            setUserPersistValues(response);
            setLoading(false);
        } catch {
            openAlertSnackbar(
                "error",
                5000,
                "Username or password incorrect. Please try again",
                "Don't have an account?"
            );
        }

    }

    const register = async (data) => {
        setLoading(true);
        try {
            const response = await registerRequest(data);
            setUserPersistValues(response);
            setLoading(false);
        } catch {
            openAlertSnackbar(
                "error",
                5000,
                "Error creating your account. Try again",
                "Oops..."
            );
        }
    }

    const logout = async () => {
        const response = await logoutRequest();
        if (response.status === 204) {
            localStorage.clear();
            window.location.reload();
        } else {
            openAlertSnackbar(
                "error",
                5000,
                "Error logging you out!"
            );
        }
    }

    const setUserPersistValues = (response) => {
        setUser(response.user);
        setToken(response.token);
        setIsAuthenticated(true);
        localStorage.setItem("USER", response.user);
        localStorage.setItem("AUTH_TOKEN", response.token);
        localStorage.setItem("AUTHENTICATION_STATUS", true);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                token,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;