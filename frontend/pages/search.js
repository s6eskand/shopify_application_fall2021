import React from 'react';
import AlertProvider from "../src/providers/AlertProvider";
import ImageProvider from "../src/providers/ImageProvider";
import AuthGate from "../src/components/auth/AuthGate";
import SearchResult from "../src/components/search/SearchResult";
import AuthProvider from "../src/providers/AuthProvider";
import { listImagesRequest } from "../src/api/imagecrud";

export async function getServerSideProps(context) {
    const { query } = context.query;

    const response = await listImagesRequest();
    let images = await response.data;
    let title;

    if (query[0] === "#") {
        images = [...images.filter(image => image.caption.includes(query))];
        title = `Search results for ${query.split(" ")[0]}`;
    } else {
        title = `Search results for ${query}`;
        images = [...images.filter(image => image.title.includes(query) || image.caption.includes(query))]
    }

    return {
        props: {
            images,
            title
        }
    }
}

function Search({ images, title }) {
    return (
        <AuthProvider>
            <AlertProvider>
                <ImageProvider>
                    <AuthGate>
                        <SearchResult images={images} title={title} />
                    </AuthGate>
                </ImageProvider>
            </AlertProvider>
        </AuthProvider>
    )
}

export default Search;
