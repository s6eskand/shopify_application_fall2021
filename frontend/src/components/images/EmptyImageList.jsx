import React from 'react';
import { Typography } from "@material-ui/core";
import Image from "next/image";
import styles from '../../../styles/EmptyImageList.module.css';

function EmptyImageList({ text, src }) {

    return (
        <div className={styles.root}>
            <Image
                width={275}
                height={225}
                src={src}
            />
            <Typography variant="body1" component="p" className={styles.text}>
                {text}
            </Typography>
        </div>
    )
}

export default EmptyImageList;