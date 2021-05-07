import React from 'react';
import { retrieveImageByTitle } from "../../src/api/imagecrud";
import Navbar from "../../src/components/Navbar";
import Head from "next/head";
import DetailedImage from "../../src/components/images/DetailedImage";

export async function getServerSideProps(context) {
    const { username, title, w, h } = context.query;

    const query = username + "?title=" + title;

    let notFound = true;
    const response = await retrieveImageByTitle(query);
    let image;
    if (response.status === 200) {
        image = await response.data;
        notFound = false;
    } else {
        image = {
            title: "404, This image doesn't exist!",
            caption: "Oops! Looks like the image you're looking for doesn't exist. Head back to the home page to see some that do!",
            image: {
                full_size: "/empty_page.png"
            }
        }
    }

    return {
        props: {
            image,
            width: w ? w : null,
            height: h ? h : null,
            notFound
        }
    }

}
function Image({ image, width, height, notFound }) {

    return (
        <>
            <Navbar />
            <Head>
                <title>{image.title}</title>
                <meta
                    name="description"
                    content={image.caption}
                />
                <meta
                    property="og:title"
                    content="Sam Eskandar"
                />
                <meta
                    property="og:description"
                    content="Personal portfolio and website of Sam Eskandar"
                />
                <meta
                    property="og:image"
                    content={image.image.full_size}
                />
            </Head>
            <DetailedImage image={image} width={width} height={height} notFound={notFound} />
        </>
    )
}

export default Image;