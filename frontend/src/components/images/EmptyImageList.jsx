import React from 'react';
import { Typography } from "@material-ui/core";
import Image from "next/image";
import styles from '../../../styles/EmptyImageList.module.css';

function EmptyImageList({ search = false }) {
    const src = search ? "/empty_page.png" : "/empty_page2.png";
    const text = search ?
        "Nothing matches your search! Try again or create your missing image!"
        :
        "Woah! Nothing here yet! Click on the new button above to get started"

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