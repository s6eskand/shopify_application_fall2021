import React, { createContext, useContext, useEffect, useState } from "react";
import {
    registerProxyRequest,
    logoutProxyRequest,
    loginProxyRequest
} from "../api/auth";
import { AlertContext } from "./AlertProvider";

export const AuthContext = createContext({
    user: {},
    isAuthenticated: false,
    loading: false,
    login: () => { },
    register: () => { },
    logout: () => { }
})

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const { openAlertSnackbar } = useContext(AlertContext);

    useEffect(() => {
        const auth = localStorage.getItem("AUTHENTICATION_STATUS");
        if (auth) {
            setIsAuthenticated(true);
            setUser(JSON.parse(localStorage.getItem("USER")));
        }
    }, [])

    const login = async (username, password, router) => {
        setLoading(true);
        const data = {
            username,
            password
        }

        try {
            const response = await loginProxyRequest(data);
            setUserPersistValues(response);
            setLoading(false);
            await router.push("/")
        } catch {
            openAlertSnackbar(
                "error",
                5000,
                "Username or password incorrect. Please try again",
                "Don't have an account?"
            );
            setLoading(false);
        }

    }

    const register = async (data, router) => {
        setLoading(true);
        try {
            const response = await registerProxyRequest(data);
            setUserPersistValues(response);
            setLoading(false);
            await router.push("/")
        } catch {
            openAlertSnackbar(
                "error",
                5000,
                "Error creating your account. Try again",
                "Oops..."
            );
            setLoading(false)
        }
    }

    const logout = async () => {
        const response = await logoutProxyRequest();
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
        setIsAuthenticated(true);
        localStorage.setItem("USER", JSON.stringify(response.user));
        localStorage.setItem("AUTHENTICATION_STATUS", true);
        localStorage.setItem("AUTH_TOKEN", response.token)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
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