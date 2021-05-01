import React, { createContext, useEffect, useState } from "react";

export const AlertContext = createContext({
    openAlert: false,
    severity: "",
    message: "",
    alertTitle: "",
    openAlertSnackbar: () => { }
})

const AlertProvider = ({ children }) => {
    const [state, setState] = useState({
        openAlert: false,
        severity: "",
        timeout: 0,
        message: "",
        alertTitle: "",
    })

    useEffect(() => {
        setTimeout(() => {
            setState({
                ...state,
                openAlert: false
            })
        }, state.timeout)
    }, [state.openAlert])

    const openAlertSnackbar = (severity, timeout, message, alertTitle = "") => {
        setState({
            ...state,
            openAlert: true,
            severity,
            timeout,
            message,
            alertTitle
        })
    }

    return (
        <AlertContext.Provider
            value={{
                ...state,
                openAlertSnackbar
            }}
        >
            {children}
        </AlertContext.Provider>
    )

}

export default AlertProvider;