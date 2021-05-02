import React from 'react';
import AlertProvider from "../src/providers/AlertProvider";
import ImageProvider, { ImageContext } from "../src/providers/ImageProvider";
import { listImagesRequest } from "../src/api/imagecrud";;
import Main from "../src/components/Main";

export async function getServerSideProps(context) {
    const response = await listImagesRequest();
    const images = await response.data;
    console.log(images);

    return {
        props: {
            images
        }
    }
}

const Home = ({ images }) => {

    return (
        <AlertProvider>
            <ImageProvider>
                <Main images={images} />
            </ImageProvider>
        </AlertProvider>
    )
}

export default Home;
