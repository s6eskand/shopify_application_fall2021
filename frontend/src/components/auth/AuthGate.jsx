import React, { useContext } from 'react';
import { AuthContext } from "../../providers/AuthProvider";
import Auth from "./Auth";

function AuthGate({ children }) {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <>
            {isAuthenticated ?
                children : <Auth />
            }
        </>
    )

}

export default AuthGate;