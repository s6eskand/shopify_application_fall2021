import React, { useContext, useEffect, useState } from "react";
import { ImageContext } from "../../providers/ImageProvider";
import ImageCard from "./ImageCard";
import styles from '../../../styles/ImageList.module.css';
import { Divider, Typography, LinearProgress } from "@material-ui/core";
import EmptyImageList from "./EmptyImageList";

function ImageList({ images, title, profile = null }) {
    const { imageList, search, imagesLoading } = useContext(ImageContext);
    const [filteredImages, setFilteredImages] = useState([]);

    useEffect(() => {
        setFilteredImages([...images])
    }, [imageList])

    const isSearch = search.length > 0;

    return (
        <>
            <Typography variant="h5" className={styles.title}>
                {title}
            </Typography>
            <Divider className={styles.divider} />
            {imagesLoading && <LinearProgress />}
            { filteredImages.length > 0 || imagesLoading ?
                <div className={styles.imagelist}>
                    {filteredImages.map((image, idx) => (
                        <div className={styles.image} key={idx}>
                            <ImageCard
                                title={image.title}
                                caption={image.caption}
                                img={image.image.full_size}
                                likes={image.likes}
                                shares={image.shares}
                                author={profile ? profile : image.author}
                            />
                        </div>
                    ))}
                </div>
                :
                <EmptyImageList
                    text={search ?
                        "Nothing matches your search! Try again or create your missing image!"
                        :
                        "Woah! Nothing here yet!"
                    }
                    src={search ? "/empty_page.png" : "/empty_page2.png"}
                />
            }
        </>
    )
}

export default ImageList;