import React from 'react';
import AlertProvider from "../src/providers/AlertProvider";
import ImageProvider from "../src/providers/ImageProvider";
import { listImagesRequest } from "../src/api/imagecrud";
import Main from "../src/components/Main";
import AuthProvider from "../src/providers/AuthProvider";

export async function getServerSideProps(context) {
    const response = await listImagesRequest();
    const images = await response.data;

    return {
        props: {
            images
        }
    }
}

const Home = ({ images }) => {

    return (
        <AuthProvider>
            <AlertProvider>
                <ImageProvider>
                    <Main images={images} />
                </ImageProvider>
            </AlertProvider>
        </AuthProvider>
    )
}

export default Home;
