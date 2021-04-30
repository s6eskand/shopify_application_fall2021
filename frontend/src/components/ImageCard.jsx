import React from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Typography, IconButton, Tooltip } from "@material-ui/core";
import { Link, OpenInNew, Reply } from "@material-ui/icons";
import styles from '../../styles/ImageCard.module.css';

function ImageCard({ title, caption, img }) {

    const handleCopy = async () => {
        await navigator.clipboard.writeText(img);
    }

    return (
        <Card className={styles.root}>
            <CardHeader
                title={title}
            />
            <CardMedia
                className={styles.media}
                image={img}
                title={caption}
                // image="https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {caption}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
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
