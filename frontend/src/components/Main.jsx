import React from 'react';
import Navbar from "./Navbar";
import Head from "next/head";
import Header from "./Header";
import ImageList from "./images/ImageList";

function Main({ images }) {

    return (
        <>
            <Navbar />
            <Head>
                <title>Sam Eskandar Image Repository</title>
                <meta name="description"
                      content="An image repository built by Sam Eskandar for the Shopify Fall 2021 Dev Challenge"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Header />
            <ImageList images={images} />
        </>
    )
}

export default Main;