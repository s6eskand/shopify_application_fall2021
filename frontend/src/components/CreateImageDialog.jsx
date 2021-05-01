import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    DialogTitle,
    Button,
    DialogContentText,
    CircularProgress,
    useMediaQuery
} from "@material-ui/core";
import {
    generateCaptionRequest_URL
} from "../api/predictionrequests";
import styles from '../../styles/CreateImageDialog.module.css';
import AlertSnackbar from "./globals/AlertSnackbar";

function CreateImageDialog({ open, handleClose }) {
    const [captionLoading, setCaptionLoading] = useState(false);
    const [state, setState] = useState({
        title: "",
        caption: "",
        image: null,
        imageUrl: "",
        openAlert: false,
        message: "",
        severity: "",
        timeout: 3000,
        alertTitle: "",
        captionError: false,
    })
    const fullscreen = useMediaQuery("(max-width:760px)");

    useEffect(() => {
        setTimeout(() => {
            setState({
                ...state,
                openAlert: false
            })
        }, state.timeout)
    }, [state.openAlert])

    const openAlertSnackbar = (severity, timeout, message, alertTitle = "") => {
        const captionError = alertTitle.length === 0;
        setState({
            ...state,
            openAlert: true,
            severity,
            timeout,
            message,
            alertTitle,
            captionError
        })
    }

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }

    const isValidURL = (url) => {
        const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return res !== null
    }

    const handleImageURLChange = () => {
        if (isValidURL(state.imageUrl)) {
            setState({
                ...state,
                image: state.imageUrl,
                captionError: false
            })
        } else {
            openAlertSnackbar(
                "error",
                3000,
                "Please enter a valid URL."
            )
        }
    }

    const generateCaption = async () => {
        setCaptionLoading(true);
        try {
            const data = { image: state.imageUrl }
            const response = await generateCaptionRequest_URL(data);
            if (response.status === 400) {
                openAlertSnackbar(
                    "error",
                    5000,
                    "Please send a valid image URL"
                )
            }
            const { generated_caption } = await response.data;
            setState({
                ...state,
                caption: generated_caption
            })
        } catch {
            openAlertSnackbar(
                "error",
                5000,
                "Oops! Something went wrong. Please try again.",
                "Something went wrong..."
            )
        }
        setCaptionLoading(false);
    }

    return (
        <>
        <Dialog open={open} fullScreen={fullscreen}>
            <DialogTitle>Add New Image to Library</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Images can be generated from captions, selected from files, or uploaded via a remote URL.
                    Image captions can be auto generated, or manually entered. If entering manually, be as descriptive
                    as possible, especially when auto generating images.
                </DialogContentText>
                <div className={styles.rowCol}>
                    <TextField
                        required
                        margin="dense"
                        value={state.title}
                        placeholder="Image title"
                        name="title"
                        label="Title"
                        onChange={handleChange}
                    />
                    <div className={styles.row}>
                        <label className={styles.filelabel}>
                            Select File
                            <input
                                className={styles.fileselect}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                            />
                        </label>
                        <TextField
                            fullWidth
                            className={styles.imageinput}
                            margin="dense"
                            value={state.imageUrl}
                            placeholder="Image URL"
                            label="Image URL"
                            name="imageUrl"
                            onChange={handleChange}
                            onBlur={handleImageURLChange}
                        />
                    </div>
                    {state.image !== null ?
                        <div className={styles.displayImage}>
                            <img
                                src={state.image}
                                width={250}
                                height={250}
                                alt={state.caption}
                            />
                        </div> : null
                    }
                    <TextField
                        required
                        margin="dense"
                        fullWidth
                        label="Caption"
                        value={state.caption}
                        name="caption"
                        onChange={handleChange}
                    />
                    <div className={styles.row}>
                        <div className={styles.buttonWrapper}>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={(!state.imageUrl && !state.image) || captionLoading || state.captionError}
                                style={{ marginRight: 10 }}
                                onClick={generateCaption}
                            >
                                Generate Caption
                            </Button>
                            {captionLoading && <CircularProgress size={24} className={styles.buttonProgress} />}
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={!state.caption || state.image}
                            >
                                Generate Image
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    color="secondary"
                >
                    Cancel
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    color="primary"
                    disabled={!state.title && !state.caption && !state.image}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
        <AlertSnackbar
            open={state.openAlert}
            message={state.message}
            severity={state.severity}
            title={state.alertTitle}
        />
        </>
    )
}

export default CreateImageDialog;