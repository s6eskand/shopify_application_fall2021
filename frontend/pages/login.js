import React from 'react';
import AuthProvider from "../src/providers/AuthProvider";
import AlertProvider from "../src/providers/AlertProvider";
import ImageProvider from "../src/providers/ImageProvider";
import Auth from "../src/components/auth/Auth";

function Login() {
    return (
        <AuthProvider>
            <AlertProvider>
                <ImageProvider>
                    <Auth />
                </ImageProvider>
            </AlertProvider>
        </AuthProvider>
    )
}

export default Login;