import React, { useContext, useState } from 'react';
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
import AlertSnackbar from "../AlertSnackbar";
import { AlertContext } from "../../providers/AlertProvider";
import { ImageContext } from "../../providers/ImageProvider";

function CreateImageDialog({ open, handleClose }) {
    const [state, setState] = useState({
        title: "",
        caption: "",
        image: ""
    })
    const [imageFile, setImageFile] = useState(null);
    const fullscreen = useMediaQuery("(max-width:760px)");
    const { openAlertSnackbar, openAlert, severity, message, alertTitle } = useContext(AlertContext);
    const { generateCaption, captionLoading, createImageLoading, createImage } = useContext(ImageContext);

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
        })
        setImageFile(null)
        handleClose();
    }

    const handleGenerateCaption = async () => {
        const formData = new FormData();
        formData.append("file", imageFile)
        const caption = await generateCaption(formData);
        if (caption) {
            setState({
                ...state,
                caption
            })
        }
    }

    const handleCreate = async () => {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", state.title);
        formData.append("caption", state.caption);
        const created = await createImage(formData);
        if (created) {
            openAlertSnackbar(
                "success",
                6000,
                "A new image has been added to the repository",
                "Successfully created image"
            );
            handleCancel();
            window.location.reload();
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
        if (file) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                setState({
                    ...state,
                    image: event.target.result
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
                    <div className={styles.rowCol}>
                        <label className={styles.filelabel}>
                            Select File
                            <input
                                className={styles.fileselect}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                            />
                        </label>
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
                    <div className={styles.buttonWrapper}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={state.image === "" || captionLoading || state.caption !== ""}
                            style={{ marginRight: 10 }}
                            onClick={handleGenerateCaption}
                        >
                            Generate Caption
                        </Button>
                        {captionLoading && <CircularProgress size={24} className={styles.buttonProgress} />}
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