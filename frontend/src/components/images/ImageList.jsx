import React, { useContext, useEffect, useState } from "react";
import { ImageContext } from "../../providers/ImageProvider";
import ImageCard from "./ImageCard";
import styles from '../../../styles/ImageList.module.css';
import { Divider, Typography, LinearProgress } from "@material-ui/core";
import EmptyImageList from "./EmptyImageList";

function ImageList({ images }) {
    const { imageList, search, imagesLoading } = useContext(ImageContext);
    const [filteredImages, setFilteredImages] = useState([]);

    useEffect(() => {
        setFilteredImages([...images])
    }, [imageList])

    useEffect(() => {
        setFilteredImages([
            ...imageList.filter(image =>
                image.title.includes(search) || image.caption.includes(search)
            )
        ])
    }, [search])

    return (
        <div className={styles.container}>
            <Typography variant="h5" className={styles.title}>
                Images
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
                            />
                        </div>
                    ))}
                </div>
                :
                <EmptyImageList search={search.length > 0} />
            }
        </div>
    )
}

export default ImageList;