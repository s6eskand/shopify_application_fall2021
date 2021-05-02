import React from 'react';
import Link from "next/link";
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Tooltip
} from "@material-ui/core";
import { Link as LinkIcon, OpenInNew, Reply } from "@material-ui/icons";
import styles from '../../../styles/ImageCard.module.css';

function ImageCard({ title, caption, img }) {

    const handleCopy = async () => {
        await navigator.clipboard.writeText(img);
    }

    const trimCaption = () => {
        if (caption.length > 99) {
            return caption.substring(0, 99) + "...";
        }
        return caption;
    }

    return (
        <Card className={styles.root}>
            <CardHeader
                className={styles.title}
                title={title}
            />
            <CardMedia
                className={styles.media}
                image={img}
                title={caption}
            />
            <CardContent className={styles.content}>
                <Typography variant="body2" color="textSecondary" component="p" className={styles.caption}>
                    {trimCaption()}
                </Typography>
            </CardContent>
            <CardActions disableSpacing className={styles.actions}>
                <Tooltip title="View full image" arrow>
                    <Link href={`/images/${title}`}>
                        <IconButton>
                            <OpenInNew />
                        </IconButton>
                    </Link>
                </Tooltip>
                <Tooltip title="Share image" arrow>
                    <IconButton>
                        <Reply />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Copy image URL" arrow>
                    <IconButton onClick={handleCopy}>
                        <LinkIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}

export default ImageCard;
