import '../styles/globals.css'
import NProgress from 'nprogress';
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { logoutRequest } from "../src/api/auth";

function MyApp({ Component, pageProps }) {

    const router = useRouter();

    const logout = (event) => {
        event.preventDefault();
        const token = localStorage.getItem("AUTH_TOKEN");
        if (token) {
            logoutRequest(token)
                .then(res => res);
        }
        localStorage.clear();
        return undefined;
    }

    useEffect(() => {

        window.addEventListener("beforeunload", logout);

        let routeChangeStart = () => NProgress.start();
        let routeChangeComplete = () => NProgress.done();

        router.events.on("routeChangeStart", routeChangeStart);
        router.events.on("routeChangeComplete", routeChangeComplete);
        router.events.on("routeChangeError", routeChangeComplete);
        return () => {
            router.events.off("routeChangeStart", routeChangeStart);
            router.events.off("routeChangeComplete", routeChangeComplete);
            router.events.off("routeChangeError", routeChangeComplete);
            window.removeEventListener("beforeunload", logout)
        };
    }, []);

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                />
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
