import React, { useContext } from "react";
import ImageProvider, { ImageContext } from "../providers/ImageProvider";
import ImageCard from "./ImageCard";
import styles from '../../styles/ImageList.module.css';
import { Divider, Typography } from "@material-ui/core";
import EmptyImageList from "./EmptyImageList";

function ImageListContent() {
    const { filteredImages, loadingImages, search } = useContext(ImageContext);

    return (
        <div className={styles.container}>
            <Typography variant="h5" className={styles.title}>
                Images
            </Typography>
            <Divider className={styles.divider} />
            { filteredImages.length > 0 ?
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
                :
                <EmptyImageList search={search.length > 0} />
            }
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