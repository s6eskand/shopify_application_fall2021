import React from 'react';
import { Typography } from "@material-ui/core";
import styles from '../../../styles/DetailedImage.module.css';

const IMAGE_SERVER_URL = "http://localhost:8000"

function DetailedImage({ image, width, height, notFound }) {
    return (
        <div className={styles.container}>
            <Typography variant="h3">
                {image.title}
            </Typography>
            <Typography variant="h6" component="p" className={styles.middle}>
                {image.caption}
            </Typography>
            <img
                src={notFound ? "" : IMAGE_SERVER_URL + image.image.full_size}
                alt={image.caption}
                width={width && width}
                height={height && height}
            />
        </div>
    )
}

export default DetailedImage;