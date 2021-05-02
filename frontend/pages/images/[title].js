import React from 'react';
import { retrieveImageByTitle } from "../../src/api/imagecrud";
import Navbar from "../../src/components/Navbar";
import Head from "next/head";

export async function getServerSideProps(context) {
    const { title } = context.query;

    const response = await retrieveImageByTitle(title);
    let image = null;
    if (response.status === 200) {
        image = await response.data;
    }

    return {
        props: {
            image,
        }
    }

}
function DetailedImage({ image }) {

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
        </>
    )
}

export default DetailedImage;