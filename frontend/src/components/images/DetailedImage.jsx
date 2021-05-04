import React from 'react';
import { Typography } from "@material-ui/core";
import styles from '../../../styles/DetailedImage.module.css';

function DetailedImage({ image, width, height }) {
    return (
        <div className={styles.container}>
            <Typography variant="h3">
                {image.title}
            </Typography>
            <Typography variant="h6" component="p" className={styles.middle}>
                {image.caption}
            </Typography>
            <img
                src={image.image.full_size}
                alt={image.caption}
                width={width && width}
                height={height && height}
            />
        </div>
    )
}

export default DetailedImage;