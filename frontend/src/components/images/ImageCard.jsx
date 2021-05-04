import React, { useContext } from 'react';
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Tooltip, Avatar
} from "@material-ui/core";
import { Link as LinkIcon, FavoriteBorder, Favorite, Reply } from "@material-ui/icons";
import styles from '../../../styles/ImageCard.module.css';
import { AlertContext } from "../../providers/AlertProvider";
import AlertSnackbar from "../globals/AlertSnackbar";

const REACT_APP_URL = "http://localhost:3000/images/"

function ImageCard({ title, caption, img, likes, shares }) {
    const { openAlertSnackbar, openAlert, severity, message, alertTitle } = useContext(AlertContext);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(img);
        openAlertSnackbar(
            "success",
            3000,
            "Image URL copied to clipboard!"
        )
    }

    const handleShare = async () => {
        await navigator.clipboard.writeText(REACT_APP_URL + title);
        openAlertSnackbar(
            "success",
            3000,
            "Shareable link copied to clipboard!",
            "Show off your photo!"
        )
    }

    const trimCaption = () => {
        if (caption.length > 99) {
            return caption.substring(0, 99) + "...";
        }
        return caption;
    }

    const formatNumber = (num) => {
        if (num >= 1000 && num < 1000000) {
            return Math.round(num / 100) / 10 + "k"
        } else if (num >= 1000000) {
            const x = num / 1000000
            return Math.round(x * 10) / 10 + "m"
        }
        return num
    }

    return (
        <>
        <Card className={styles.root}>
            <CardHeader
                className={styles.title}
                title={title}
                avatar={<Avatar>P</Avatar>}
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
                <div className={styles.actiontextcontainer}>
                    <IconButton>
                        <FavoriteBorder />
                    </IconButton>
                    <p className={styles.actiontext}>{` ${formatNumber(likes)} likes`}</p>
                </div>
                <div className={styles.actiontextcontainer}>
                    <Tooltip title="Share image" arrow>
                        <IconButton onClick={handleShare}>
                            <Reply />
                        </IconButton>
                    </Tooltip>
                    <p className={styles.actiontext}>{` ${formatNumber(shares)} shares`}</p>
                </div>
                <Tooltip title="Copy image URL" arrow>
                    <IconButton onClick={handleCopy}>
                        <LinkIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
        <AlertSnackbar
            open={openAlert}
            message={message}
            severity={severity}
            title={alertTitle}
        />
        </>
    )
}

export default ImageCard;
