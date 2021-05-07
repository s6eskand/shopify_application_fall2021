import React from 'react';
import Navbar from "./Navbar";
import Head from "next/head";
import Header from "./Header";
import ImageList from "./images/ImageList";
import styles from '../../styles/ImageList.module.css'

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
            <div className={styles.container}>
                <ImageList images={images} title="Featured Images" />
            </div>
        </>
    )
}

export default Main;