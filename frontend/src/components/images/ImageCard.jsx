import React from 'react';
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
import { Link, OpenInNew, Reply } from "@material-ui/icons";
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
                <Tooltip title="Open in new window" arrow>
                    <IconButton>
                        <OpenInNew />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Share image" arrow>
                    <IconButton>
                        <Reply />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Copy image URL" arrow>
                    <IconButton onClick={handleCopy}>
                        <Link />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}

export default ImageCard;
