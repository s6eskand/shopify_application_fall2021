import React, { useContext, useState } from 'react';
import SearchBar from "./search/SearchBar";
import { Button } from '@material-ui/core';
import styles from '../../styles/Header.module.css';
import { ImageContext } from "../providers/ImageProvider";
import { AlertContext } from "../providers/AlertProvider";
import AlertSnackbar from "./AlertSnackbar";

function Header({ isImageSearch = false }) {
    const [image, setImage] = useState({
        file: null,
        src: ""
    });
    const { showImageSearch, setShowImageSearch, reverseImageSearch } = useContext(ImageContext);
    const { openAlertSnackbar, openAlert, severity, message, alertTitle } = useContext(AlertContext);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                setImage({
                    file,
                    src: event.target.result
                });
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

    const handleSearch = async () => {
        if (image.file) {
            await reverseImageSearch(image.file);
        }
    }

    const handleCancel = () => {
        setShowImageSearch(false);
    }

    return (
        <>
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <SearchBar isImageSearch={isImageSearch} />
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
                        {image.src !== "" ?
                            <div className={styles.displayImage}>
                                <img
                                    src={image.src}
                                    width={250}
                                    alt="your uploaded image"
                                />
                                <div className={styles.searchActions}>
                                    <Button
                                        onClick={handleSearch}
                                        variant="outlined"
                                        color="primary"
                                        style={{marginRight: 10}}
                                    >
                                        Search
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outlined"
                                        color="secondary"
                                    >
                                        Cancel
                                    </Button>
                                </div>
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