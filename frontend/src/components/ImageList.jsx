import React, { useContext } from "react";
import ImageProvider, { ImageContext } from "../providers/ImageProvider";
import ImageCard from "./ImageCard";
import styles from '../../styles/ImageList.module.css';
import { Divider, Typography } from "@material-ui/core";

function ImageListContent() {
    const { filteredImages, loadingImages } = useContext(ImageContext);

    return (
        <div className={styles.container}>
            <Typography variant="h5" className={styles.title}>
                Images
            </Typography>
            <Divider className={styles.divider} />
            <div className={styles.imagelist}>
                {filteredImages.map(image => (
                    <div className={styles.image}>
                        <ImageCard
                            title={image.title}
                            caption={image.caption}
                            img={image.image.full_size}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

const ImageList = () => {
    return (
        <ImageProvider>
            <ImageListContent />
        </ImageProvider>
    )
}
export default ImageList;