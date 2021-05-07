import React, { useContext, useState } from 'react';
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
import AlertSnackbar from "../AlertSnackbar";
import { useRouter } from "next/router";
import { updateLikesOrShares } from "../../api/imagecrud";

const REACT_APP_URL = "http://localhost:3000/images/"
const IMAGE_SERVER_URL = "http://localhost:8000";

function ImageCard({ id, title, caption, img, likes, shares, author }) {
    const [liked, setLiked] = useState(false);
    const [numLikes, setNumLikes] = useState(likes);
    const [numShares, setNumShares] = useState(shares);
    const { openAlertSnackbar, openAlert, severity, message, alertTitle } = useContext(AlertContext);
    const router = useRouter();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(IMAGE_SERVER_URL + img);
        openAlertSnackbar(
            "success",
            3000,
            "Image URL copied to clipboard!"
        )
    }

    const handleLike = async () => {
        const value = liked ? -1 : 1;
        setNumLikes(prevState => prevState + value)
        setLiked(prevState => !prevState);
        const data = {
            pk: id,
            likes: value,
            shares: 0
        }
        const response = await updateLikesOrShares(data);
        if (response.status !== 204) {
            setNumLikes(prevState => prevState - value);
            setLiked(prevState => !prevState)
        }
    }

    const handleShare = async () => {
        await navigator.clipboard.writeText(REACT_APP_URL + title);
        setNumShares(prevState => prevState + 1);
        openAlertSnackbar(
            "success",
            3000,
            "Shareable link copied to clipboard!",
            "Show off your photo!"
        )
        await updateLikesOrShares({pk: id, likes: 0, shares: 1});
    }

    const handleNavigate = async () => {
        await router.push("/user/@" + author.username)
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

    const avatar = () => {
        if (author.profile_picture !== null) {
            return (
                <Avatar alt={author.username} src={IMAGE_SERVER_URL + author.profile_picture} />
            )
        } else {
            return (
                <Avatar>
                    {author?.username[0].toUpperCase()}
                </Avatar>
            )
        }
    }

    return (
        <>
        <Card className={styles.root}>
            <CardHeader
                onClick={handleNavigate}
                className={styles.title}
                title={title}
                subheader={`By: ${author.username}`}
                avatar={avatar()}
            />
            <CardMedia
                className={styles.media}
                image={IMAGE_SERVER_URL + img}
                title={caption}
            />
            <CardContent className={styles.content}>
                <Typography variant="body2" color="textSecondary" component="p" className={styles.caption}>
                    {trimCaption()}
                </Typography>
            </CardContent>
            <CardActions disableSpacing className={styles.actions}>
                <div className={styles.actiontextcontainer}>
                    <IconButton onClick={handleLike}>
                        {liked ? <Favorite color="secondary" /> : <FavoriteBorder/>}
                    </IconButton>
                    <p className={styles.actiontext}>{` ${formatNumber(numLikes)} likes`}</p>
                </div>
                <div className={styles.actiontextcontainer}>
                    <Tooltip title="Share image" arrow>
                        <IconButton onClick={handleShare}>
                            <Reply />
                        </IconButton>
                    </Tooltip>
                    <p className={styles.actiontext}>{` ${formatNumber(numShares)} shares`}</p>
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
