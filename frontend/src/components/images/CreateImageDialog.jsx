import React, { useContext, useEffect, useState } from 'react';
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
import styles from '../../../styles/CreateImageDialog.module.css';
import AlertSnackbar from "../globals/AlertSnackbar";
import { AlertContext } from "../../providers/AlertProvider";
import { ImageContext } from "../../providers/ImageProvider";

function CreateImageDialog({ open, handleClose }) {
    const [state, setState] = useState({
        title: "",
        caption: "",
        image: "",
        imageUrl: "",
        captionError: false,
    })
    const fullscreen = useMediaQuery("(max-width:760px)");
    const { openAlertSnackbar, openAlert, severity, message, alertTitle } = useContext(AlertContext);
    const { generateCaption, captionLoading, createImageLoading, createImage, listImages } = useContext(ImageContext);

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }

    const handleCancel = () => {
        setState({
            title: "",
            caption: "",
            image: "",
            imageUrl: "",
            captionError: false,
        })
        handleClose();
    }

    const handleGenerateCaption = async () => {
        const caption = await generateCaption(state.imageUrl);
        if (caption) {
            setState({
                ...state,
                caption
            })
        } else {
            setState({
                ...state,
                captionError: true
            })
        }
    }

    const convertBlobToFile = () => {
        const contentType = state.image.mimeType.split("/")[1]
        const filename = state.title + "." + contentType;
        return new File([state.image], filename, contentType);
    }

    const handleCreate = async () => {
        const data = new FormData();
        data.append("image", convertBlobToFile());
        data.append("title", state.title);
        data.append("caption", state.caption);
        const created = createImage(data);
        if (created) {
            listImages();
            handleCancel();
            openAlertSnackbar(
                "success",
                6000,
                "A new image has been added to the repository",
                "Successfully created image"
            );
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                setState({
                    ...state,
                    image: event.target.result,
                    captionError: false
                })
            }
            fileReader.onerror = (event) => {
                openAlertSnackbar(
                    "error",
                    3000,
                    "Error reading file contents"
                )
            }
        }
    }

    const isValidURL = (url) => {
        const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return res !== null
    }

    const handleImageURLChange = () => {
        if (state.imageUrl !== "") {
            if (isValidURL(state.imageUrl)) {
                setState({
                    ...state,
                    image: state.imageUrl,
                    captionError: false
                })
            } else {
                setState({
                    ...state,
                    captionError: true
                })
                openAlertSnackbar(
                    "error",
                    3000,
                    "Not a valid image URL!"
                )
            }
        }
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
                                onChange={handleFileChange}
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
                    {state.image !== "" ?
                        <div className={styles.displayImage}>
                            <img
                                src={state.image}
                                width={250}
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
                                disabled={(!state.imageUrl && state.image === "") || captionLoading || state.captionError}
                                style={{ marginRight: 10 }}
                                onClick={handleGenerateCaption}
                            >
                                Generate Caption
                            </Button>
                            {captionLoading && <CircularProgress size={24} className={styles.buttonProgress} />}
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={!state.caption}
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
                    onClick={handleCancel}
                    color="secondary"
                >
                    Cancel
                </Button>
                <div className={styles.buttonWrapper}>
                    <Button
                        variant="outlined"
                        onClick={handleCreate}
                        color="primary"
                        disabled={!state.title || !state.caption || state.image === ""}
                    >
                        Create
                    </Button>
                    {createImageLoading && <CircularProgress size={24} className={styles.buttonProgress} />}
                </div>
            </DialogActions>
        </Dialog>
        <AlertSnackbar
            open={openAlert}
            message={message}
            severity={severity}
            title={alertTitle}
        />
        </>
    )
}

export default CreateImageDialog;