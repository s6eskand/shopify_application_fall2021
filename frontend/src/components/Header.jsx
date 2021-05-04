import React, { useContext, useState } from 'react';
import SearchBar from "./SearchBar";
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import styles from '../../styles/Header.module.css';
import ImageProvider, { ImageContext } from "../providers/ImageProvider";
import AlertProvider, { AlertContext } from "../providers/AlertProvider";
import CreateImageDialog from "./images/CreateImageDialog";
import AlertSnackbar from "./globals/AlertSnackbar";

function Header() {
    const [image, setImage] = useState("");
    const { openDialog, setOpenDialog, showImageSearch } = useContext(ImageContext);
    const { openAlertSnackbar, openAlert, severity, message, alertTitle } = useContext(AlertContext);

    const handleOpen = () => setOpenDialog(true);
    const handleClose = () => setOpenDialog(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                setImage(event.target.result)
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
            <CreateImageDialog open={openDialog} handleClose={handleClose} />
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <SearchBar />
                        <Button variant="outlined" className={styles.button} onClick={handleOpen}>
                            <Add /> New
                        </Button>
                    </div>
                    <div className={styles.upload} style={ !showImageSearch ? { display: 'none' } : null }>
                        <label className={styles.uploadLabel}>
                            Select Image
                            <input
                                style={{ display: 'none' }}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                            />
                        </label>
                        {image !== "" ?
                            <div className={styles.displayImage}>
                                <img
                                    src={image}
                                    width={250}
                                    alt="your uploaded image"
                                />
                                <Button
                                    // TODO implement search by image function
                                    color="primary"
                                >
                                    Search
                                </Button>
                            </div> : null
                        }
                    </div>
                </div>
            </div>
            <AlertSnackbar
                open={openAlert}
                message={message}
                severity={severity}
                title={alertTitle}
            />
        </>
    )
}

export default Header;