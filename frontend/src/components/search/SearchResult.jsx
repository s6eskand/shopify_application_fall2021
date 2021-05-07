import React from 'react';
import Head from "next/head";
import Navbar from "../Navbar";
import ImageList from "../images/ImageList";
import Header from "../Header";
import styles from '../../../styles/ImageList.module.css';

function SearchResult({ images, title }) {
    return(
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
                <ImageList images={images} title={title} />
            </div>
        </>
    )
}

export default SearchResult;